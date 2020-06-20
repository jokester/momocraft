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

  beforeEach(TestDeps.resetTestDB);

  afterAll(bundledAfterAll);

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
