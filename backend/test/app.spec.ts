import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { GoogleOAuthResponse, GoogleOAuthService } from '../src/auth/google-oauth.service';
import { MockData, TestDeps } from './test-deps';
import { right } from 'fp-ts/lib/Either';
import { AuthModule } from '../src/auth/auth.module';
import { TypeORMConnection } from '../src/db/typeorm-connection.provider';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TypeORMConnection)
      .useValue(TestDeps.testConnection)
      .compile();

    app = moduleFixture.createNestApplication();

    await app.init();
    await TestDeps.clearTestDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  describe(AuthModule, () => {
    it('POST /auth/oauth/google', async () => {
      jest
        .spyOn(GoogleOAuthService.prototype, 'auth')
        .mockResolvedValue(right<string, GoogleOAuthResponse>(MockData.googleOAuthResponseValid));

      await request(app.getHttpServer())
        .post('/auth/oauth/google')
        .send({ code: '123', redirectUrl: '456' })
        .expect(201)
        .expect(res => {
          const jwtToken = JSON.parse(res.text).jwtToken;
          expect(jwtToken).toBeTruthy();
        });
    });
  });
});
