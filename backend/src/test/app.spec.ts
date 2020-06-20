import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import { GoogleOAuthResponse, GoogleOAuthService } from '../user/google-oauth.service';
import { MockData, TestDeps } from './test-deps';
import { right } from 'fp-ts/lib/Either';
import { JwtService } from '@nestjs/jwt';
import { getDebugLogger } from '../util/get-debug-logger';
import { UserService } from '../user/user.service';
import { AuthController, AuthSuccessRes } from '../user/auth.controller';
import { MomoUserController } from '../momo/momo-user.controller';
import { getSomeOrThrow } from '../util/fpts-getter';
import { absent } from '../util/absent';
import { EmailAuthRequestDto } from '../model/auth.dto';
import { DiscordOAuth } from '../user/oauth-client.provider';
import { buildTesteeAppBundle } from './test-app-factory';

const logger = getDebugLogger(__filename);

describe('AppController (e2e)', () => {
  const { testBundle, bundledAfterAll, bundledBeforeAll } = buildTesteeAppBundle();
  let app: INestApplication;
  let jwtService: JwtService;
  let userService: UserService;

  beforeAll(async () => {
    await bundledBeforeAll();
    app = testBundle.app;
    jwtService = testBundle.jwtService;
    userService = testBundle.userService;
  });

  beforeEach(TestDeps.clearTestDatabase);

  afterAll(bundledAfterAll);

  describe(AuthController, () => {
    it('POST /auth/oauth/google returns jwtToken on succeed', async () => {
      jest
        .spyOn(GoogleOAuthService.prototype, 'auth')
        .mockResolvedValue(right<string, GoogleOAuthResponse>(MockData.googleOAuthResponseValid));

      const res = await request(app.getHttpServer()).post('/auth/oauth/google').send(MockData.oauthRequest).expect(201);

      const jwtToken = JSON.parse(res.text).jwtToken;
      expect(jwtToken).toBeTruthy();

      const decoded = await jwtService.decode(jwtToken);
      logger('decoded', decoded);

      await jwtService.verifyAsync(jwtToken);
    });

    it('POST /auth/oauth/google return 400 on malformed request', async () => {
      await request(app.getHttpServer()).post('/auth/oauth/google').send({ code: '123', redirectUrl: '' }).expect(400);
    });

    it('POST /auth/oauth/google return 400 on auth error', async () => {
      jest
        .spyOn(GoogleOAuthService.prototype, 'auth')
        .mockResolvedValue(right<string, GoogleOAuthResponse>(MockData.googleOAuthResponseEmailUnverified));

      const authErrorRes = await request(app.getHttpServer())
        .post('/auth/oauth/google')
        .send({ code: '123', redirectUrl: 'someUrl' })
        .expect(400);

      expect(authErrorRes.body).toMatchSnapshot('auth 400 res');
    });

    it('POST /auth/email/signup creates user and returns 201', async () => {
      {
        // signup success
        const created = await request(app.getHttpServer())
          .post('/auth/email/signup')
          .send(MockData.authPayload)
          .expect(201);

        const res: AuthSuccessRes = JSON.parse(created.text);
        expect(res.jwtToken).toBeTruthy();
        expect(res.user).toMatchSnapshot('POST /auth/email/signup 201');
      }

      {
        // signup fail: email must be unique
        await request(app.getHttpServer())
          .post('/auth/email/signup')
          .send({ email: 'a@B.com', password: '1234567' } as EmailAuthRequestDto)
          .expect(400);
      }
    });

    it('POST /auth/email/signin auths user', async () => {
      {
        /// signin success
        const signedIn = await request(app.getHttpServer())
          .post('/auth/email/signin')
          .send(MockData.authPayload)
          .expect(200);

        const res: AuthSuccessRes = JSON.parse(signedIn.text);
        expect(res.jwtToken).toBeTruthy();
        expect(res.user).toMatchSnapshot('POST /auth/email/signin 200');
      }

      {
        // signin fail: password incorrect
        await request(app.getHttpServer())
          .post('/auth/email/signin')
          .send({ ...MockData.authPayload, password: '123456789' })
          .expect(400);

        // signin fail: email incorrect
        await request(app.getHttpServer())
          .post('/auth/email/signin')
          .send({ ...MockData.authPayload, email: 'b@c.com' })
          .expect(400);
      }
    });
  });

  describe.skip(MomoUserController, () => {
    it('GET /user/:userId returns 404', async () => {
      await request(app.getHttpServer()).get('/user/__s').expect(404);
    });

    it('GET /user/self with improper auth header returns 400', async () => {
      await request(app.getHttpServer()).get('/user/self').set('Authorization', `Bear`).expect(400);
    });

    it('GET /user/self without auth return 401', async () => {
      await request(app.getHttpServer()).get('/user/self').expect(401);
    });

    it('GET /user/self with proper auth returns resolved user', async () => {
      const userAccount1 = getSomeOrThrow(await userService.findUser({ userId: '' }), () => absent('user by shortId'));

      const jwtToken = await userService.createJwtTokenForUser(userAccount1);

      await request(app.getHttpServer()).get('/user/self').set('Authorization', `Bearer ${jwtToken}`).expect(200);

      await request(app.getHttpServer()).get('/momo/user/self').set('Authorization', `Bearer ${jwtToken}`).expect(200);
    });

    it('PUT /user/self updated resolved user', async () => {
      const userAccount1 = getSomeOrThrow(await userService.findUser({ userId: '' }), () => absent('user by shortId'));

      const jwtToken = await userService.createJwtTokenForUser(userAccount1);

      const { body } = await request(app.getHttpServer())
        .put('/user/self')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ nickName: 'samuel mf jackson', avatarUrl: 'https://corp.com/a.gif' })
        .expect(200);

      expect(body).toMatchSnapshot('updated user');

      const { body: body2 } = await request(app.getHttpServer())
        .get('/user/self')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(body2).toEqual(body);
    });
  });
});
