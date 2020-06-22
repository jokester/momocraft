import { UserController } from './user.controller';
import { buildTesteeAppBundle } from '../test/test-app-factory';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { MockData, TestDeps } from '../test/test-deps';
import { getRightOrThrow } from '../util/fpts-getter';
import request from 'supertest';
import { AuthSuccessRes } from '../auth/auth.controller';
import { UserProfileDto } from '../model/user-profile.dto';

describe(UserController, () => {
  const testee = buildTesteeAppBundle();
  let app: INestApplication;
  let jwtService: JwtService;
  let userService: UserService;

  beforeAll(async () => {
    await testee.bundledBeforeAll();
    app = testee.testBundle.app;
    jwtService = testee.testBundle.jwtService;
    userService = app.get(UserService);
  });
  afterAll(testee.bundledAfterAll);

  beforeEach(TestDeps.resetTestDB);

  describe('when user exists', () => {
    it('returns user profile', async () => {
      const signedUp = getRightOrThrow(
        await userService.signUpWithEmail(MockData.authPayload.email, MockData.authPayload.password),
        () => new Error(),
      );

      const signedIn = await request(app.getHttpServer())
        .post('/auth/email/signin')
        .send(MockData.authPayload)
        .expect(200);

      const res: AuthSuccessRes = JSON.parse(signedIn.text);

      const gotOwnProfile = await request(app.getHttpServer())
        .get('/user/@me')
        .auth(res.jwtToken, { type: 'bearer' })
        .expect(200);

      const ownProfile: UserProfileDto = JSON.parse(gotOwnProfile.text);

      expect(ownProfile).toEqual(await userService.resolveUser(signedUp));

      const gotUserProfile = await request(app.getHttpServer()).get(`/user/${ownProfile.userId}`).expect(200);

      expect(JSON.parse(gotUserProfile.text)).toEqual(ownProfile);
    });
  });
});
