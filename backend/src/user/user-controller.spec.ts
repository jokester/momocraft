import { UserController } from './user.controller';
import { buildTesteeAppBundle } from '../test/test-app-factory';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { MockData, TestDeps } from '../test/test-deps';
import { getRightOrThrow, getSomeOrThrow } from '../util/fpts-getter';
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

  beforeEach(async () => {
    getRightOrThrow(
      await userService.signUpWithEmail(MockData.authPayload.email, MockData.authPayload.password),
      () => new Error(),
    );
  });

  describe('GET /user/@me', () => {
    it('returns 200 when authed', async () => {
      const theUser = getRightOrThrow(
        await userService.signInWithEmail(MockData.authPayload.email.toUpperCase(), MockData.authPayload.password),
        () => new Error(),
      );

      const signedIn = await request(app.getHttpServer())
        .post('/auth/email/signin')
        .send(MockData.authPayload)
        .expect(200);

      const res: AuthSuccessRes = JSON.parse(signedIn.text);
      expect(res.user).toEqual(await userService.resolveUser(theUser));

      const gotOwnProfile = await request(app.getHttpServer())
        .get('/user/@me')
        .auth(res.jwtToken, { type: 'bearer' })
        .expect(200);

      const ownProfile: UserProfileDto = JSON.parse(gotOwnProfile.text);

      expect(ownProfile).toEqual(await userService.resolveUser(theUser));
    });

    it('return 400 when auth header is improper', async () => {
      await request(app.getHttpServer()).get('/user/self').set('Authorization', `Bear`).expect(400);
    });

    it('returns 401 when not authed', async () => {
      await request(app.getHttpServer()).get('/user/@me').expect(401);
    });
  });

  describe('GET /user/:userId', () => {
    it('return 200 for existed user', async () => {
      const theUser = getRightOrThrow(
        await userService.signInWithEmail(MockData.authPayload.email.toLowerCase(), MockData.authPayload.password),
        () => new Error(),
      );

      const gotUserProfile = await request(app.getHttpServer()).get(`/user/${theUser.userId}`).expect(200);

      expect(JSON.parse(gotUserProfile.text)).toEqual(await userService.resolveUser(theUser));
    });

    it('return 404 for nonexist user', async () => {
      await request(app.getHttpServer()).get('/user/__s').expect(404);
    });
  });
});
