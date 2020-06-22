import { AuthController, AuthSuccessRes } from './auth.controller';
import { buildTesteeAppBundle } from '../test/test-app-factory';
import { INestApplication } from '@nestjs/common';
import { MockData, TestDeps } from '../test/test-deps';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { DiscordOAuth, GoogleOAuth } from './oauth-client.provider';
import { UserService } from '../user/user.service';
import { getRightOrThrow } from '../util/fpts-getter';
import { getDebugLogger } from '../util/get-debug-logger';
import { EmailAuthRequestDto } from '../model/auth.dto';

const logger = getDebugLogger(__filename);

describe(AuthController, () => {
  const testee = buildTesteeAppBundle();
  let app: INestApplication;
  let jwtService: JwtService;
  let discordOAuthClient: DiscordOAuth.Client;
  let googleOAuthClient: GoogleOAuth.Client;
  let authController: AuthController;
  let userService: UserService;

  beforeAll(async () => {
    await testee.bundledBeforeAll();
    app = testee.testBundle.app;
    jwtService = testee.testBundle.jwtService;
    discordOAuthClient = testee.testBundle.discordOAuthClient;
    googleOAuthClient = testee.testBundle.googleOAuthClient;
    authController = app.get(AuthController);
    userService = app.get(UserService);
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
        const u1 = await authController.doDiscordOAuth(MockData.oauthRequest);
        const u2 = await authController.doDiscordOAuth(MockData.oauthRequest);

        expect(await userService.findUserWithJwtToken(u1.jwtToken)).toEqual(
          await userService.findUserWithJwtToken(u2.jwtToken),
        );
      });

      it('creates UserAccount and OAuthAccount when none existed', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/oauth/discord')
          .send(MockData.oauthRequest)
          .expect(201);

        const jwtToken = JSON.parse(res.text).jwtToken;
        await jwtService.verifyAsync(jwtToken);
      });

      it('links existed UserAccount  to new OAuthAccount', async () => {
        const emailCreated = getRightOrThrow(
          await userService.signUpWithEmail(MockData.discordOAuthUserInfoValid.email, '123456789'),
          (l) => new Error(l),
        );

        const oAuthAuthed = await authController.doDiscordOAuth(MockData.oauthRequest);

        const user = getRightOrThrow(await userService.findUserWithJwtToken(oAuthAuthed.jwtToken), (l) => new Error(l));

        expect(user.internalUserId).toEqual(emailCreated.internalUserId);
      });
    });

    describe('when discord rejects oauth', () => {
      beforeEach(() => {
        jest
          // @ts-ignore
          .spyOn(discordOAuthClient, 'oauthCallback')
          .mockResolvedValue(MockData.discordOAuthTokenValid);

        jest
          // @ts-ignore
          .spyOn(discordOAuthClient, 'userinfo')
          .mockRejectedValue({});
      });

      it('return 400', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/oauth/discord')
          .send(MockData.oauthRequest)
          .expect(400);
      });
    });
  });

  describe('POST /auth/oauth/google', () => {
    describe('when google allows oauth', () => {
      beforeEach(() => {
        jest
          // @ts-ignore
          .spyOn(googleOAuthClient, 'oauthCallback')
          .mockResolvedValue(MockData.googleOAuthResponseValid.tokenSet);

        jest
          // @ts-ignore
          .spyOn(googleOAuthClient, 'userinfo')
          .mockResolvedValue(MockData.googleOAuthResponseValid.userInfo);
      });

      it('returns 201/jwtToken on succeed', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/oauth/google')
          .send(MockData.oauthRequest)
          .expect(201);

        const jwtToken = JSON.parse(res.text).jwtToken;
        expect(jwtToken).toBeTruthy();

        const decoded = await jwtService.decode(jwtToken);
        logger('decoded', decoded);

        await jwtService.verifyAsync(jwtToken);
      });

      it('returns 400 on malformed request', async () => {
        await request(app.getHttpServer())
          .post('/auth/oauth/google')
          .send({ code: '123', redirectUrl: '' })
          .expect(400);
      });
    });

    describe('when google returns unverified user profile', () => {
      beforeEach(() => {
        jest
          // @ts-ignore
          .spyOn(googleOAuthClient, 'oauthCallback')
          .mockResolvedValue(MockData.googleOAuthResponseValid.tokenSet);
        jest
          // @ts-ignore
          .spyOn(googleOAuthClient, 'userinfo')
          .mockResolvedValue(MockData.googleOAuthResponseEmailUnverified.userInfo);
      });

      it('return 400 on auth error', async () => {
        const authErrorRes = await request(app.getHttpServer())
          .post('/auth/oauth/google')
          .send({ code: '123', redirectUrl: 'someUrl' })
          .expect(400);

        expect(authErrorRes.body).toMatchSnapshot('auth 400 res');
      });
    });
  });

  describe('POST /auth/email/signup', () => {
    it('returns 201 + user on success', async () => {
      const created = await request(app.getHttpServer())
        .post('/auth/email/signup')
        .send(MockData.authPayload)
        .expect(201);

      const res: AuthSuccessRes = JSON.parse(created.text);
      expect(res.jwtToken).toBeTruthy();
      expect(res.user).toMatchSnapshot('POST /auth/email/signup 201');
    });

    it('returns 400 when email is not unique', async () => {
      getRightOrThrow(
        await userService.signUpWithEmail(MockData.authPayload.email, MockData.authPayload.password),
        (l) => new Error(l),
      );

      await request(app.getHttpServer())
        .post('/auth/email/signup')
        .send({ email: 'a@B.com', password: '1234567' } as EmailAuthRequestDto)
        .expect(400);
    });
  });

  describe('POST /auth/email/signin', () => {
    it('returns 200 + session when succeed', async () => {
      const u = await userService.signUpWithEmail(MockData.authPayload.email, MockData.authPayload.password);

      /// signin success
      const signedIn = await request(app.getHttpServer())
        .post('/auth/email/signin')
        .send(MockData.authPayload)
        .expect(200);

      const res: AuthSuccessRes = JSON.parse(signedIn.text);
      expect(res.jwtToken).toBeTruthy();
      expect(await userService.findUserWithJwtToken(res.jwtToken)).toEqual(u);
    });

    it('returns 400 when email/pass unmatch', async () => {
      const u = await userService.signUpWithEmail(MockData.authPayload.email, MockData.authPayload.password);

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
    });
  });
});
