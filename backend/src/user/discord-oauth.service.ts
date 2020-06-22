import { Inject, Injectable, Scope } from '@nestjs/common';

import { getDebugLogger } from '../util/get-debug-logger';
import { DiscordOAuth } from './oauth-client.provider';
import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import { OAuthRequestDto } from '../model/auth.dto';
import { UserService } from './user.service';
import { ErrorCodeEnum } from '../const/error-code';
import { UserAccount } from '../db/entities/user-account';
import { OAuthProvider } from '../const/oauth-conf';

const logger = getDebugLogger(__filename);

@Injectable({ scope: Scope.DEFAULT })
export class DiscordOAuthService {
  constructor(
    @Inject(DiscordOAuth.DiToken) private readonly client: DiscordOAuth.Client,
    private readonly userService: UserService,
  ) {}

  async attemptAuth(param: OAuthRequestDto): Promise<Either<ErrorCodeEnum, UserAccount>> {
    const externalIdentity = await this.fetchIdentity(param);

    if (isLeft(externalIdentity)) return externalIdentity;

    const { tokenSet, userInfo } = externalIdentity.right;

    if (!(userInfo?.email && userInfo?.verified)) {
      return left(ErrorCodeEnum.oAuthEmailNotVerified);
    }

    const externalId = userInfo.email.toLowerCase();
    return this.userService.findOrCreateWithOAuth(OAuthProvider.discord, externalId, tokenSet, userInfo);
  }

  private async fetchIdentity({
    redirectUrl,
    code,
  }: OAuthRequestDto): Promise<Either<ErrorCodeEnum, DiscordOAuth.Authed>> {
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
