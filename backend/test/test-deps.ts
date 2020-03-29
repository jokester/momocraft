import { createConnection } from 'typeorm';
import { UserAccount } from '../src/db/entities/user-account';
import { OAuthAccount } from '../src/db/entities/oauth-account';
import { EntropyService } from '../src/deps/entropy.service';

export namespace TestDeps {
  export const testConnection = createConnection({
    type: 'postgres',
    url: 'postgresql://pguser:secret@127.0.0.1:53432/hanko_test',
    synchronize: true,
    logger: 'debug',
    entities: [UserAccount, OAuthAccount],
  });

  export async function clearTestDatabase() {
    const conn = await testConnection;
    await conn.createEntityManager().clear(UserAccount);
    await conn.createEntityManager().clear(OAuthAccount);
  }

  export const entropy = new EntropyService();
}

export namespace MockData {
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
    },
  } as const;

  export const googleOAuthResponseEmailUnverified = {
    ...googleOAuthResponseValid,
    // eslint-disable-next-line @typescript-eslint/camelcase
    userInfo: { ...googleOAuthResponseValid.userInfo, verified_email: null },
  } as const;
}
