import { AuthController } from '../user/auth.controller';
import { buildTesteeAppBundle } from './test-app-factory';
import { INestApplication } from '@nestjs/common';
import { MockData, TestDeps } from './test-deps';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { DiscordOAuth } from '../user/oauth-client.provider';

describe(AuthController, () => {
  const testee = buildTesteeAppBundle();
  let app: INestApplication;
  let jwtService: JwtService;
  let discordOAuthClient: DiscordOAuth.Client;
  let authController: AuthController;

  beforeAll(async () => {
    await testee.bundledBeforeAll();
    app = testee.testBundle.app;
    jwtService = testee.testBundle.jwtService;
    discordOAuthClient = testee.testBundle.discordOAuthClient;
    authController = app.get(AuthController);
  });
  afterAll(testee.bundledAfterAll);

  beforeEach(TestDeps.resetTestDB);

  describe('POST /auth/oauth/discord', () => {
    describe('when discord allows oauth', () => {
      beforeEach(() => {
        jest
          // @ts-ignore
          .spyOn(discordOAuthClient, 'oauthCallback')
          .mockResolvedValue(MockData.discordOAuthTokenValid);

        jest
          // @ts-ignore
          .spyOn(discordOAuthClient, 'userinfo')
          .mockResolvedValue(MockData.discordOAuthUserInfoValid);
      });

      it('creates user at controller', async () => {
        const x = await authController.doDiscordOAuth(MockData.oauthRequest);
      });

      it('creates UserAccount and OAuthAccount when none existed', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/oauth/discord')
          .send(MockData.oauthRequest)
          .expect(201);

        const jwtToken = JSON.parse(res.text).jwtToken;
        await jwtService.verifyAsync(jwtToken);
      });
    });
  });
});
