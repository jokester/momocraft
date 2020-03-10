import { google } from 'googleapis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getDebugLogger } from '../util/get-debug-logger';
import { oauth2 } from 'googleapis/build/src/apis/oauth2';

const logger = getDebugLogger(__filename);

@Injectable()
export class GoogleOAuthService {
  constructor(private readonly confService: ConfigService) {}

  async auth(code: string) {
    const client = this.createAuthClient();
    logger('client=%O', client);
    logger('code=', code);

    const token = await client.getToken(code);
    client.setCredentials(token.tokens);
    logger('token=%O', token);

    const x = await oauth2({ version: 'v2', auth: client });
    const got = await x.userinfo.get();
    return got.data;
  }

  private createAuthClient() {
    return new google.auth.OAuth2({
      clientId: this.confService.get('OAUTH_GOOGLE_CLIENT_ID'),
      clientSecret: this.confService.get('OAUTH_GOOGLE_CLIENT_SECRET'),
      redirectUri: this.confService.get('OAUTH_GOOGLE_REDIRECT_URI'),
    });
  }
}
