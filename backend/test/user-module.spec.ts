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
      // eslint-disable-next-line @typescript-eslint/camelcase
      verified_email: true,
    },
  } as const;

  const foldUser = fold<string, UserAccount, Partial<UserAccount & { _error: string }>>(
    l => ({ _error: l }),
    r => r,
  );

  describe('create user with google outh', () => {
    it('does create with proper auth info', async () => {
      const testee = new UserService(await testDeps.testConnection, testDeps.entropy);

      const created1 = foldUser(await testee.findOrCreateWithGoogleOAuth(mockGoogleOAuthResult));

      expect(created1?.userId).toBeTruthy();
      expect(created1?.shortId).toBeTruthy();

      const created2 = foldUser(await testee.findOrCreateWithGoogleOAuth(mockGoogleOAuthResult));

      expect(created2).toEqual(created1);
    });

    it('refuse to create user when email not verified', async () => {
      const testee = new UserService(await testDeps.testConnection, testDeps.entropy);
      const mocked2 = {
        ...mockGoogleOAuthResult,
        // eslint-disable-next-line @typescript-eslint/camelcase
        userInfo: { ...mockGoogleOAuthResult.userInfo, verified_email: null },
      } as const;

      const created1 = foldUser(await testee.findOrCreateWithGoogleOAuth(mocked2));

      expect(created1?._error).toEqual('email must be verified');
    });
  });
});
