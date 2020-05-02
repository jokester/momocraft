import { google, oauth2_v2 as GoogleOAuth2V2 } from 'googleapis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getDebugLogger } from '../util/get-debug-logger';
import { oauth2 } from 'googleapis/build/src/apis/oauth2';
import { Either, left, right } from 'fp-ts/lib/Either';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';
import { absent } from '../util/absent';

const logger = getDebugLogger(__filename);

export interface GoogleOAuthResponse {
  credentials: GetTokenResponse;
  userInfo: GoogleOAuth2V2.Schema$Userinfoplus;
}

@Injectable()
export class GoogleOAuthService {
  constructor(private readonly confService: ConfigService) {}

  async auth(code: string, redirectUrl: string): Promise<Either<string, GoogleOAuthResponse>> {
    const client = this.createAuthClient(redirectUrl);

    let token;
    try {
      token = await client.getToken(code);
    } catch (e) {
      logger('GoogleOAuthService#auth error getting token', e);
      return left('error in auth');
    }

    try {
      client.setCredentials(token.tokens);
      const oauthUserInfo = oauth2({ version: 'v2', auth: client });
      const got = await oauthUserInfo.userinfo.get();

      logger('GoogleOAuthService#auth', got);

      return right({
        credentials: token,
        userInfo: got.data,
      });
    } catch (e) {
      logger('GoogleOAuthService#auth thrown', e);

      return left('GoogleOAuthService#auth error getting user info');
    }
  }

  private createAuthClient(redirectUrl: string) {
    return new google.auth.OAuth2({
      clientId: this.confService.get('OAUTH_GOOGLE_CLIENT_ID') || absent('$OAUTH_GOOGLE_CLIENT_ID'),
      clientSecret: this.confService.get('OAUTH_GOOGLE_CLIENT_SECRET') || absent('$OAUTH_GOOGLE_CLIENT_SECRET'),
      redirectUri:
        redirectUrl || this.confService.get('OAUTH_GOOGLE_REDIRECT_URI') || absent('$OAUTH_GOOGLE_REDIRECT_URI'),
    });
  }
}
