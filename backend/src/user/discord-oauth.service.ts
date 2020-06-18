import { Inject, Injectable, Scope } from '@nestjs/common';
import { DiscordOAuth } from './oauth-client.provider';
import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import { getDebugLogger } from '../util/get-debug-logger';
import { TypeORMConnection } from '../db/typeorm-connection.provider';
import { Connection } from 'typeorm';
import { ErrorCodeEnum } from '../const/error-code';
import { UserService } from './user.service';
import { UserAccount } from '../db/entities/user-account';
import { OAuthProvider } from '../db/entities/oauth-account';

const logger = getDebugLogger(__filename);

@Injectable({ scope: Scope.DEFAULT })
export class DiscordOauthService {
  constructor(
    @Inject(DiscordOAuth.DiToken) private readonly client: DiscordOAuth.Client,
    @Inject(TypeORMConnection) private readonly conn: Connection,
    private readonly userService: UserService,
  ) {}

  async attemptAuth(code: string, redirectUrl: string): Promise<Either<ErrorCodeEnum, UserAccount>> {
    const discordIdentity = await this.fetchAuthedUser(code, redirectUrl);

    if (isLeft(discordIdentity)) return discordIdentity;

    const { tokenSet, userInfo } = discordIdentity.right;

    return this.userService.findOrCreateWithOAuth(OAuthProvider.discord, tokenSet, userInfo);
  }

  private async fetchAuthedUser(
    code: string,
    redirectUrl: string,
  ): Promise<Either<ErrorCodeEnum, DiscordOAuth.Authed>> {
    try {
      const tokenSet = await this.client.callback(redirectUrl, { code });
      logger('DiscordOauthService#attemptAuth', tokenSet);
      const userInfo = await this.client.userinfo(tokenSet);
      logger('DiscordOauthService#attemptAuth', userInfo);

      return right({ tokenSet, userInfo });
    } catch (e) {
      return left(ErrorCodeEnum.oAuthFailed);
    }
  }
}
