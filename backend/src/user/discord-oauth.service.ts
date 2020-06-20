import { Inject, Injectable, Scope } from '@nestjs/common';
import { DiscordOAuth } from './oauth-client.provider';
import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import { getDebugLogger } from '../util/get-debug-logger';
import { ErrorCodeEnum } from '../const/error-code';
import { UserService } from './user.service';
import { UserAccount } from '../db/entities/user-account';
import { OAuthProvider } from '../const/oauth-conf';

const logger = getDebugLogger(__filename);

@Injectable({ scope: Scope.DEFAULT })
export class DiscordOAuthService {
  constructor(
    @Inject(DiscordOAuth.DiToken) private readonly client: DiscordOAuth.Client,
    private readonly userService: UserService,
  ) {}

  async attemptAuth(code: string, redirectUrl: string): Promise<Either<ErrorCodeEnum, UserAccount>> {
    const discordIdentity = await this.fetchAuthedUser(code, redirectUrl);

    if (isLeft(discordIdentity)) return discordIdentity;

    const { tokenSet, userInfo } = discordIdentity.right;

    if (!(userInfo?.email && userInfo?.verified)) {
      return left(ErrorCodeEnum.oAuthEmailNotVerified);
    }

    const externalId = userInfo.email.toLowerCase();
    return this.userService.findOrCreateWithOAuth(OAuthProvider.discord, externalId, tokenSet, userInfo);
  }

  private async fetchAuthedUser(
    code: string,
    redirectUrl: string,
  ): Promise<Either<ErrorCodeEnum, DiscordOAuth.Authed>> {
    try {
      const tokenSet = await this.client.oauthCallback(redirectUrl, { code });
      logger('DiscordOauthService#attemptAuth tokenSet', tokenSet);
      const userInfo = (await this.client.userinfo(tokenSet)) as DiscordOAuth.UserInfo;
      logger('DiscordOauthService#attemptAuth userInfo', userInfo);

      return right({ tokenSet, userInfo });
    } catch (e) {
      logger('DiscordOauthService#attemptAuth fail', e);
      return left(ErrorCodeEnum.oAuthFailed);
    }
  }
}
