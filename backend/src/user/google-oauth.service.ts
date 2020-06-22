import { Inject, Injectable, Scope } from '@nestjs/common';

import { getDebugLogger } from '../util/get-debug-logger';
import { GoogleOAuth } from './oauth-client.provider';
import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import { OAuthRequestDto } from '../model/auth.dto';
import { UserService } from './user.service';
import { ErrorCodeEnum } from '../const/error-code';
import { UserAccount } from '../db/entities/user-account';
import { OAuthProvider } from '../const/oauth-conf';

const logger = getDebugLogger(__filename);

@Injectable({ scope: Scope.DEFAULT })
export class GoogleOAuthService {
  constructor(
    @Inject(GoogleOAuth.DiToken) private readonly client: GoogleOAuth.GoogleOAuthClient,
    private readonly userService: UserService,
  ) {}

  async attemptAuth(param: OAuthRequestDto): Promise<Either<ErrorCodeEnum, UserAccount>> {
    const externalIdentity = await this.fetchIdentity(param);

    if (isLeft(externalIdentity)) return externalIdentity;

    const { tokenSet, userInfo } = externalIdentity.right;

    if (!(userInfo?.email && userInfo?.email_verified)) {
      return left(ErrorCodeEnum.oAuthEmailNotVerified);
    }

    const externalId = userInfo.email.toLowerCase();
    return this.userService.findOrCreateWithOAuth(OAuthProvider.google, externalId, tokenSet, userInfo);
  }

  private async fetchIdentity({
    redirectUrl,
    code,
  }: OAuthRequestDto): Promise<Either<ErrorCodeEnum, GoogleOAuth.Authed>> {
    try {
      const tokenSet = await this.client.oauthCallback(redirectUrl, { code });
      logger('GoogleOAuthService#fetchAuthedUser tokenSet', tokenSet);

      const userInfo = (await this.client.userinfo(tokenSet)) as GoogleOAuth.UserInfo;
      logger('GoogleOAuthService#fetchAuthedUser userInfo', userInfo);

      return right({ tokenSet, userInfo });
    } catch (e) {
      logger('GoogleOAuthService#fetchAuthedUser thrown', e);
      return left(ErrorCodeEnum.oAuthFailed);
    }
  }
}
