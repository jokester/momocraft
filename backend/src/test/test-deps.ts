import { createConnection } from 'typeorm';
import { UserAccount } from '../db/entities/user-account';
import { OAuthAccount } from '../db/entities/oauth-account';
import { EntropyService } from '../deps/entropy.service';
import { DeepReadonly } from '@jokester/ts-commonutil/cjs/type/freeze';
import { GoogleOAuthResponse } from '../user/google-oauth.service';
import { JwtService } from '@nestjs/jwt';
import { EmailAuthRequestDto } from '../model/auth.dto';

export namespace TestDeps {
  export const testConnection = createConnection({
    type: 'postgres',
    url: 'postgresql://pguser:secret@127.0.0.1:54432/momo_test',
    synchronize: true,
    logger: 'debug',
    entities: [UserAccount, OAuthAccount],
  });

  export async function clearTestDatabase(): Promise<void> {
    const conn = await testConnection;
    await conn.synchronize(true);
    await conn.createEntityManager().clear(UserAccount);
    await conn.createEntityManager().clear(OAuthAccount);
  }

  export async function dropTestDatabase(): Promise<void> {
    const conn = await testConnection;
  }

  export const mockedEntropy = new EntropyService();

  export const mockedJwtService = new JwtService({ secret: 'veryverysecret', signOptions: { expiresIn: '7 days' } });
}

export namespace MockData {
  export const authPayload = { email: 'a@b.com', password: '1234567' } as EmailAuthRequestDto;

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
}
