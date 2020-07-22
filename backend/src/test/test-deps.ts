import { EntropyService } from '../deps/entropy.service';
import { DeepReadonly } from '@jokester/ts-commonutil/cjs/type/freeze';
import { JwtService } from '@nestjs/jwt';
import { EmailAuthRequestDto, OAuthRequestDto } from '../model/auth.dto';
import { DiscordOAuth, GoogleOAuth } from '../auth/oauth-client.provider';
import { getTestConn } from './test-db';

export namespace TestDeps {
  export const testConnection = getTestConn();

  export async function resetTestDB(): Promise<void> {
    const conn = await testConnection;
    await conn.transaction(async (em) => await em.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`));
    await conn.runMigrations({ transaction: 'all' });
  }

  export const mockedEntropy = new EntropyService();

  export const mockedJwtService = new JwtService({ secret: 'veryverysecret', signOptions: { expiresIn: '7 days' } });
}

export namespace MockData {
  export const authPayload = { email: 'a@B.com', password: '1234567' } as EmailAuthRequestDto;

  export const oauthRequest = { code: '123', redirectUrl: '456' } as OAuthRequestDto;

  export const googleOAuthResponseValid: DeepReadonly<GoogleOAuth.Authed> = {
    tokenSet: {
      expired(): boolean {
        return false;
      },
      claims(): never {
        throw 'wont be called';
      },
      res: null,
    },
    userInfo: {
      sub: 0 as never,
      email: 'hey@me.com',
      email_verified: true,
      picture: 'https://example.com/a.png',
    },
  };

  export const googleOAuthResponseEmailUnverified = {
    ...googleOAuthResponseValid,
    userInfo: { ...googleOAuthResponseValid.userInfo, email_verified: false },
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
