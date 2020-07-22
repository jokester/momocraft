import { UserService } from './user.service';
import { MockData, TestDeps } from '../test/test-deps';
import { UserAccount } from '../db/entities/user-account';
import { OAuthAccount } from '../db/entities/oauth-account';
import { fold } from 'fp-ts/lib/Either';
import { JwtService } from '@nestjs/jwt';

describe(UserService, () => {
  let testee: UserService;
  const jwtService = new JwtService({ secret: 'vaaaaaaarysecret' });

  beforeEach(async () => {
    const conn = (await TestDeps.testConnection).createEntityManager();
    await conn.clear(UserAccount);
    await conn.clear(OAuthAccount);
    testee = new UserService(await TestDeps.testConnection, jwtService, TestDeps.mockedEntropy);
  });

  const foldUser = fold<string, UserAccount, Partial<UserAccount & { _error?: string }>>(
    (l) => ({ _error: l }),
    (r) => r,
  );

  describe.skip('create user with google outh', () => {
    it('does create with proper auth info', async () => {
      const created1 = foldUser(await testee.findUserWithJwtToken(''));

      expect(created1?.internalUserId).toBeTruthy();
      expect(created1?.userId).toBeTruthy();

      const created2 = foldUser(await testee.findUserWithJwtToken(''));

      expect(created2).toEqual(created1);
    });

    it('refuse to create user when email not verified', async () => {
      const created1 = foldUser(await testee.findUserWithJwtToken(''));

      expect(created1?._error).toEqual('email must be verified');
    });
  });
});
