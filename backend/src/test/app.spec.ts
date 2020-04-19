import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import { GoogleOAuthResponse, GoogleOAuthService } from '../auth/google-oauth.service';
import { MockData, TestDeps } from './test-deps';
import { right, isLeft } from 'fp-ts/lib/Either';
import { AuthModule } from '../auth/auth.module';
import { TypeORMConnection } from '../db/typeorm-connection.provider';
import { JwtService } from '@nestjs/jwt';
import { getDebugLogger } from '../util/get-debug-logger';
import { UserService } from '../user/user.service';
import { UserController } from '../user/user.controller';
import { UserModule } from '../user/user.module';

const logger = getDebugLogger(__filename);

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let userService: UserService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TypeORMConnection)
      .useValue(TestDeps.testConnection)
      .compile();

    app = moduleFixture.createNestApplication();
    jwtService = await moduleFixture.resolve(JwtService);
    userService = await moduleFixture.resolve(UserService);

    await app.init();
    await TestDeps.clearTestDatabase();
  });

  afterAll(async done => {
    await app.close();
    done();
  });

  describe(JwtService, () => {
    const origPayload = { something: 'really something' } as const;
    it('signs payload to jwt token', async () => {
      const token = await jwtService.signAsync(origPayload);

      const verified = await jwtService.verifyAsync<typeof origPayload>(token);

      expect(verified.something).toEqual(origPayload.something);
    });

    it('refuses to verify JWT with no sign algorithm', async () => {
      const token = await jwtService.signAsync(origPayload, { algorithm: 'none' });

      const verified = jwtService.verifyAsync<typeof origPayload>(token);

      await expect(verified).rejects.toThrowError(/jwt signature is required/i);
    });

    it('throws on different key', async () => {
      const anotherJwtService = new JwtService({ secret: 'aaaasecret' });
      const token = await anotherJwtService.signAsync(origPayload);
      await expect(jwtService.verifyAsync(token)).rejects.toThrowError('invalid signature');
    });

    it('throws on malformed jwt token', async () => {
      const token = 'ajfal;sdf';
      expect(() => jwtService.verify(token)).toThrowError('jwt malformed');
    });

    it('throws on expired token', async () => {
      const token = await jwtService.signAsync(origPayload);
      await expect(
        jwtService.verifyAsync(token, { clockTimestamp: Date.now() / 1e3 + 7 * 24 * 3600 - 10 }),
      ).resolves.toBeTruthy();

      await expect(
        jwtService.verifyAsync(token, { clockTimestamp: Date.now() / 1e3 + 7 * 24 * 3600 }),
      ).rejects.toThrowError(/jwt expired/);
    });
  });

  describe(AuthModule, () => {
    it('POST /auth/oauth/google returns jwtToken on succeed', async () => {
      jest
        .spyOn(GoogleOAuthService.prototype, 'auth')
        .mockResolvedValue(right<string, GoogleOAuthResponse>(MockData.googleOAuthResponseValid));

      const res = await request(app.getHttpServer())
        .post('/auth/oauth/google')
        .send({ code: '123', redirectUrl: '456' })
        .expect(200);

      const jwtToken = JSON.parse(res.text).jwtToken;
      expect(jwtToken).toBeTruthy();

      const decoded = await jwtService.decode(jwtToken);
      logger('decoded', decoded);

      await jwtService.verifyAsync(jwtToken);

      await request(app.getHttpServer())
        .get('/auth/jwt/validate')
        .expect(400);

      const {
        body: { shortId, ...stableFields },
      } = await request(app.getHttpServer())
        .get('/auth/jwt/validate')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(stableFields).toMatchSnapshot('jwt/validate');

      const {
        body: { shortId: shortId2, ...stableFields2 },
      } = await request(app.getHttpServer())
        .get(`/user/${shortId}`)
        .expect(200);

      expect(stableFields2).toEqual(stableFields);
    });

    it('POST /auth/oauth/google return 400 on malformed request', async () => {
      await request(app.getHttpServer())
        .post('/auth/oauth/google')
        .send({ code: '123', redirectUrl: '' })
        .expect(400);
    });

    it('POST /auth/oauth/google return 400 on auth error', async () => {
      jest
        .spyOn(GoogleOAuthService.prototype, 'auth')
        .mockResolvedValue(right<string, GoogleOAuthResponse>(MockData.googleOAuthResponseEmailUnverified));

      await request(app.getHttpServer())
        .post('/auth/oauth/google')
        .send({ code: '123', redirectUrl: 'someUrl' })
        .expect(400);
    });
  });

  describe(UserModule, () => {
    it('GET /user/:shortId returns 404', async () => {
      await request(app.getHttpServer())
        .get('/user/__s')
        .expect(404);
    });
  });
});
