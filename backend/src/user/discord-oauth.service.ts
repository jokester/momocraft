import { Inject, Injectable } from '@nestjs/common';
import { DiscordOAuth } from './oauth-client.provider';
import { TokenSet, UserinfoResponse } from 'openid-client';
import { Either, left, right } from 'fp-ts/lib/Either';
import { getDebugLogger } from '../util/get-debug-logger';

interface DiscordTokenSet extends TokenSet {}

interface DiscordUserInfo extends UserinfoResponse {}

const logger = getDebugLogger(__filename);

@Injectable()
export class DiscordOauthService {
  constructor(@Inject(DiscordOAuth.DiToken) private readonly client: DiscordOAuth.Client) {}

  async issueRequestUrl() {
    const x = this.client.authorizationUrl({});
  }

  async handleCallbackUrl(
    url: string,
  ): Promise<Either<string, { tokens: DiscordTokenSet; userInfo: DiscordUserInfo }>> {
    try {
      const param = this.client.callbackParams(url);
      if (!param.code) {
        return left('illegal callback url');
      }

      const tokens = await this.client.callback(url, param);
      const userInfo = await this.client.userinfo(tokens);

      if (!(userInfo.email && userInfo.email_verified)) {
        return left('email not verified');
      }
      return right({ tokens, userInfo });
    } catch (e) {
      return left('internal error');
    }
  }
}
