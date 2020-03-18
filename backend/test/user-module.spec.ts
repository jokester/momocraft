import { UserService } from '../src/user/user.service';
import { testDeps } from './test-deps';
import { UserAccount } from '../src/db/entities/user-account';
import { OAuthAccount } from '../src/db/entities/oauth-account';
import { fold } from 'fp-ts/lib/Either';
import { userInfo } from 'os';

describe(UserService, () => {
  beforeEach(async () => {
    const conn = (await testDeps.testConnection).createEntityManager();
    await conn.clear(UserAccount);
    await conn.clear(OAuthAccount);
  });

  const mockGoogleOAuthResult = {
    credentials: {
      tokens: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        id_token: 'iiid-token',
      },
      res: null,
    },
    userInfo: {
      email: 'hey@me.com',
    },
  } as const;

  const foldUser = fold<string, UserAccount, Partial<string | UserAccount>>(
    l => l,
    r => r,
  );

  it('create user with google oauth', async () => {
    const testee = new UserService(await testDeps.testConnection, testDeps.entropy);

    const created = await testee.findOrCreateWithGoogleOAuth(mockGoogleOAuthResult);

    const folded1 = fold<string, UserAccount, null | UserAccount>(
      l => null,
      r => r,
    )(created);

    expect(folded1?.userId).toBeTruthy();
    expect(folded1?.shortId).toBeTruthy();

    const created2 = await testee.findOrCreateWithGoogleOAuth(mockGoogleOAuthResult);

    const folded2 = foldUser(created2);
    expect(folded2).toEqual(folded1);
  });
});
