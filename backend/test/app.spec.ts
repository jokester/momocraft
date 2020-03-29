import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { GoogleOAuthResponse, GoogleOAuthService } from '../src/auth/google-oauth.service';
import { MockData, TestDeps } from './test-deps';
import { right } from 'fp-ts/lib/Either';
import { AuthModule } from '../src/auth/auth.module';
import { TypeORMConnection } from '../src/db/typeorm-connection.provider';
import { JwtService } from '@nestjs/jwt';
import { getDebugLogger } from '../src/util/get-debug-logger';

const logger = getDebugLogger(__filename);

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TypeORMConnection)
      .useValue(TestDeps.testConnection)
      .compile();

    app = moduleFixture.createNestApplication();
    jwtService = await moduleFixture.resolve(JwtService);

    await app.init();
    await TestDeps.clearTestDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  describe(JwtService, () => {
    const origPayload = { something: 'really something' } as const;
    it('signs payload to jwt token', async () => {
      const token = await jwtService.signAsync(origPayload);
      const verified = await jwtService.verify<typeof origPayload>(token);

      expect(verified.something).toEqual(origPayload.something);
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
    it('POST /auth/oauth/google', async () => {
      jest
        .spyOn(GoogleOAuthService.prototype, 'auth')
        .mockResolvedValue(right<string, GoogleOAuthResponse>(MockData.googleOAuthResponseValid));

      const res = await request(app.getHttpServer())
        .post('/auth/oauth/google')
        .send({ code: '123', redirectUrl: '456' })
        .expect(201);

      const jwtToken = JSON.parse(res.text).jwtToken;
      expect(jwtToken).toBeTruthy();

      const decoded = await jwtService.decode(jwtToken);
      logger('decoded', decoded);

      await jwtService.verifyAsync(jwtToken);
    });
  });
});
