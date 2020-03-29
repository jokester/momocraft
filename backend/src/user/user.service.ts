import { Inject, Injectable } from '@nestjs/common';
import { getDebugLogger } from '../util/get-debug-logger';
import { Either, left, right } from 'fp-ts/lib/Either';
import { GoogleOAuthResponse } from '../auth/google-oauth.service';
import { TypeORMConnection } from '../db/typeorm-connection.provider';
import { Connection, DeepPartial } from 'typeorm';
import { OAuthAccount, OAuthProvider } from '../db/entities/oauth-account';
import { UserAccount } from '../db/entities/user-account';
import { EntropyService } from '../deps/entropy.service';
import { JwtService } from '@nestjs/jwt';

const logger = getDebugLogger(__filename);

interface JwtTokenPayload {
  userId: number;
}

@Injectable()
export class UserService {
  constructor(
    @Inject(TypeORMConnection) private conn: Connection,
    private jwtService: JwtService,
    private entropy: EntropyService,
  ) {}

  async find(userId: number): Promise<Either<string, UserAccount>> {
    const existedUser = await this.conn.getRepository(UserAccount).findOne({ userId });

    if (!existedUser) {
      return left('user not found');
    }
    return right(existedUser);
  }

  async findUserWithJwtToken(
    jwtToken: string,
    overrideCurrentTimestamp?: number,
  ): Promise<Either<string, UserAccount>> {
    let payload: JwtTokenPayload;
    try {
      payload = await this.jwtService.verify<JwtTokenPayload>(jwtToken, {
        clockTimestamp: overrideCurrentTimestamp ?? Date.now() / 1e3,
      });
    } catch (e) {
      return left('invalid token');
    }

    const user = await this.conn.getRepository(UserAccount).findOne({ userId: payload.userId });
    if (!user) {
      throw new Error('user not found');
    }
    return right(user);
  }

  createJwtTokenForUser(user: UserAccount): Promise<string> {
    return this.jwtService.signAsync({ userId: user.userId } as JwtTokenPayload);
  }

  async findOrCreateWithGoogleOAuth(oauthResponse: GoogleOAuthResponse): Promise<Either<string, UserAccount>> {
    if (oauthResponse?.userInfo?.verified_email !== true) {
      return left('email must be verified');
    }
    const oAuthAccountRepo = this.conn.getRepository(OAuthAccount);

    const existedOAuth = await oAuthAccountRepo.findOne({ externalId: oauthResponse.credentials.tokens.id_token! });

    // return existed user
    if (existedOAuth) {
      const [user] = await this.conn.getRepository(UserAccount).find({ userId: existedOAuth.userId });

      if (!user) {
        // surprise
        throw new Error('user not exist');
      }

      // update oauth account
      Object.assign(existedOAuth, {
        credentials: oauthResponse.credentials,
        userInfo: oauthResponse.userInfo,
      });

      await oAuthAccountRepo.save(existedOAuth as DeepPartial<OAuthAccount>);

      return right(user);
    }

    // try create
    const res = await this.conn.transaction(async entityManager => {
      const userAccount = await entityManager.save(
        new UserAccount({
          shortId: this.entropy.createNanoId(),
        }),
      );
      const oauthAccount = await entityManager.save(
        new OAuthAccount({
          provider: OAuthProvider.googleOAuth2,
          userId: userAccount.userId,
          externalId: oauthResponse.credentials.tokens.id_token!,
          credentials: oauthResponse.credentials,
          userInfo: oauthResponse.userInfo,
        }),
      );

      return right(userAccount);
    });

    return res;
  }
}
