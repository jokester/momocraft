import { createConnection } from 'typeorm';
import { UserAccount } from '../db/entities/user-account';
import { OAuthAccount } from '../db/entities/oauth-account';
import { EntropyService } from '../deps/entropy.service';
import { DeepReadonly } from '@jokester/ts-commonutil/cjs/type/freeze';
import { GoogleOAuthResponse } from '../user/google-oauth.service';
import { JwtService } from '@nestjs/jwt';
import { EmailAuthRequestDto, OAuthRequestDto } from '../model/auth.dto';
import { DiscordOAuth } from '../user/oauth-client.provider';
import path from 'path';

export namespace TestDeps {
  export const testConnection = createConnection({
    type: 'postgres',
    url: process.env['TEST_DB_URL'] || 'postgresql://pguser:secret@127.0.0.1:54432/momo_test',
    logger: 'debug',
    entities: [UserAccount, OAuthAccount],
    migrations: [path.join(__dirname, '../db/migrations')],
  });

  export async function resetTestDB(): Promise<void> {
    const conn = await testConnection;
    await conn.transaction(async (em) => await em.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`));
    await conn.showMigrations();
    await conn.runMigrations();
  }

  export const mockedEntropy = new EntropyService();

  export const mockedJwtService = new JwtService({ secret: 'veryverysecret', signOptions: { expiresIn: '7 days' } });
}

export namespace MockData {
  export const authPayload = { email: 'a@b.com', password: '1234567' } as EmailAuthRequestDto;

  export const oauthRequest = { code: '123', redirectUrl: '456' } as OAuthRequestDto;

  export const googleOAuthResponseValid = {
    credentials: {
      tokens: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        id_token: 'iiid-token',
      },
      res: null,
    },
    userInfo: {
      email: 'hey@me.com',
      // eslint-disable-next-line @typescript-eslint/camelcase
      verified_email: true,
      picture: 'https://example.com/a.png',
    },
  } as DeepReadonly<GoogleOAuthResponse>;

  export const googleOAuthResponseEmailUnverified = {
    ...googleOAuthResponseValid,
    // eslint-disable-next-line @typescript-eslint/camelcase
    userInfo: { ...googleOAuthResponseValid.userInfo, verified_email: null },
  } as const;

  export const discordOAuthTokenValid: DiscordOAuth.TokenSet = {
    access_token: 'valid',
    expired: () => false,
    claims: fail,
  };

  export const discordOAuthUserInfoValid: DiscordOAuth.UserInfo = {
    email: 'discord-user@example.com',
    verified: true,
  } as any;
}
