import { Inject, Injectable, Scope } from '@nestjs/common';
import { getDebugLogger } from '../util/get-debug-logger';
import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import { TypeORMConnection } from '../db/typeorm-connection.provider';
import { Connection } from 'typeorm';
import { OAuthAccount } from '../db/entities/oauth-account';
import { UserAccount } from '../db/entities/user-account';
import { EntropyService } from '../deps/entropy.service';
import { JwtService } from '@nestjs/jwt';
import { fromNullable, isNone, Option } from 'fp-ts/lib/Option';
import { absent } from '../util/absent';
import { Sanitize } from '../util/input-santinizer';
import { randomAlphaNum } from '@jokester/ts-commonutil/cjs/text/random-string';
import { ErrorCodeEnum } from '../const/error-code';
import { UserProfileDto } from '../model/user-profile.dto';
import { TokenSet, UserinfoResponse } from 'openid-client';
import { OAuthProvider } from '../const/oauth-conf';

const logger = getDebugLogger(__filename);

interface JwtTokenPayload {
  userId: string;
}

@Injectable({ scope: Scope.DEFAULT })
export class UserService {
  constructor(
    @Inject(TypeORMConnection) private conn: Connection,
    private jwtService: JwtService,
    private entropy: EntropyService,
  ) {}

  async findBatch(condition: { userId: string[] }): Promise<UserAccount[]> {
    return this.conn.getRepository(UserAccount).find({ where: condition });
  }

  async findUser(
    condition: { userId: string } | { emailId: string } | { internalUserId: number },
  ): Promise<Option<UserAccount>> {
    const existedUser = await this.conn.getRepository(UserAccount).findOne(condition);
    return fromNullable(existedUser);
  }

  async findUserWithJwtToken(
    jwtToken: string,
    currentTimestamp = this.entropy.now(),
  ): Promise<Either<string, UserAccount>> {
    let payload: JwtTokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtTokenPayload>(jwtToken, {
        clockTimestamp: currentTimestamp / 1e3,
      });
    } catch (e) {
      return left(ErrorCodeEnum.notAuthenticated);
    }

    const user = await this.conn.getRepository(UserAccount).findOne({ userId: payload.userId });
    if (!user) {
      throw new Error('user not found'); // should not happen
    }
    return right(user);
  }

  async signUpWithEmail(email: string, password: string): Promise<Either<string, UserAccount>> {
    const sanitizedEmail = Sanitize.email(email),
      sanitizedPass = Sanitize.pass(password);

    if (isLeft(sanitizedEmail)) return sanitizedEmail;
    if (isLeft(sanitizedPass)) return sanitizedPass;

    return this.conn
      .getRepository(UserAccount)
      .save({
        userId: this.entropy.createUserStringId(),
        internalMeta: {},
        emailId: sanitizedEmail.right,
        passwordHash: await this.entropy.bcryptHash(sanitizedPass.right),
      })
      .then(right, (err) => {
        logger('UserService#signUpWithEmail error creating', err);
        return left(ErrorCodeEnum.userExisted);
      });
  }

  async signInWithEmail(email: string, password: string): Promise<Either<string, UserAccount>> {
    const sanitizedEmail = Sanitize.email(email),
      sanitizedPass = Sanitize.pass(password);

    if (isLeft(sanitizedEmail)) return sanitizedEmail;
    if (isLeft(sanitizedPass)) return sanitizedPass;

    const user = await this.findUser({ emailId: sanitizedEmail.right });
    if (isNone(user)) return left(ErrorCodeEnum.userNotFound);

    const passwordMatched = await this.entropy.bcryptValidate(sanitizedPass.right, user.value.passwordHash);

    if (passwordMatched) return right(user.value);
    return left(ErrorCodeEnum.passwordUnmatch);
  }

  async resolveUser(userAccount: UserAccount): Promise<UserProfileDto> {
    const oauthAccounts = await this.conn.getRepository(OAuthAccount).find({ userId: userAccount.internalUserId });

    /** TODO: use user info from OAuthAccount */

    return {
      userId: userAccount.userId,
      email: userAccount.emailId,
      avatarUrl: undefined,
    };
  }

  createJwtTokenForUser(user: UserAccount): Promise<string> {
    return this.jwtService.signAsync({ userId: user.userId } as JwtTokenPayload);
  }

  async updateUserMeta(
    condition: Partial<Pick<UserAccount, 'userId' | 'internalUserId' | 'emailId'>>,
    meta: object,
  ): Promise<UserAccount> {
    const user =
      (await this.conn.getRepository(UserAccount).findOne(condition)) || absent('updateInternalMeta: user not found');
    user.setInternalMeta(meta);
    await this.conn.getRepository(UserAccount).save(user);
    return user;
  }

  async findOrCreateWithOAuth(
    provider: OAuthProvider,
    externalLowercaseEmailId: string,
    tokenSet: TokenSet,
    userInfo: UserinfoResponse,
  ): Promise<Either<ErrorCodeEnum, UserAccount>> {
    const oAuthAccountRepo = this.conn.getRepository(OAuthAccount);

    const existedOAuth = await oAuthAccountRepo.findOne({ externalId: externalLowercaseEmailId });

    /**
     * when oauth account existed: update and return
     */
    if (existedOAuth) {
      const [
        user = absent(`userId=${existedOAuth.userId} from existedOAuthId=${existedOAuth.oAuthAccountId}`),
      ] = await this.conn.getRepository(UserAccount).find({ internalUserId: existedOAuth.userId });

      const updated = await oAuthAccountRepo.update(
        { oAuthAccountId: existedOAuth.oAuthAccountId },
        {
          credentials: tokenSet,
          userInfo,
        },
      );

      if (updated.affected !== 1) {
        throw new Error(`error updating existed OAuthAccount`);
      }

      return right(user);
    }

    /**
     * when user with same email existed: link to new OAuthAccount and return
     */
    const existedUserWithSameEmail = await this.conn
      .getRepository(UserAccount)
      .findOne({ emailId: externalLowercaseEmailId });
    if (existedUserWithSameEmail) {
      await this.conn.getRepository(OAuthAccount).save({
        provider,
        userId: existedUserWithSameEmail.internalUserId,
        externalId: externalLowercaseEmailId,
        credentials: tokenSet,
        userInfo: userInfo,
      });
      return right(existedUserWithSameEmail);
    }

    const randomPass = await this.entropy.bcryptHash(randomAlphaNum(16));

    return this.conn.transaction(async (entityManager) => {
      const userAccount = await entityManager.save(
        new UserAccount({
          userId: this.entropy.createUserStringId(),
          internalMeta: {},
          emailId: externalLowercaseEmailId,
          passwordHash: randomPass,
        }),
      );
      const oauthAccount = await entityManager.save(
        new OAuthAccount({
          provider,
          userId: userAccount.internalUserId,
          externalId: externalLowercaseEmailId,
          credentials: tokenSet,
          userInfo: userInfo,
        }),
      );

      return right(userAccount);
    });
  }
}
