import { BadRequestException, Body, Controller, Header, HttpCode, Post, Request } from '@nestjs/common';
import { getDebugLogger } from '../util/get-debug-logger';
import { GoogleOAuthService } from './google-oauth.service';
import { ResolvedUser, UserService } from './user.service';
import { getRightOrThrow } from '../util/fpts-getter';
import { Sanitize } from '../util/input-santinizer';
import { UserAccount } from '../db/entities/user-account';
import { EmailAuthPayload } from '../linked-frontend/api/hanko-api';
import { AuthedUser } from './user-jwt-auth.middleware';

const logger = getDebugLogger(__filename);

export interface AuthSuccessRes {
  jwtToken: string;
  user: ResolvedUser;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly googleOAuthService: GoogleOAuthService, private readonly userService: UserService) {}

  @Post('oauth/google')
  @HttpCode(200)
  @Header('Cache-Control', 'private;max-age=0;')
  async doGoogleOAuth(
    @Request() req: Request,
    @Body() payload: { code: string; redirectUrl: string },
    // eslint-disable-next-line @typescript-eslint/camelcase
  ): Promise<{ jwtToken: string }> {
    if (payload && payload.code && payload.redirectUrl) {
      const oauthRes = getRightOrThrow(
        await this.googleOAuthService.auth(payload.code, payload.redirectUrl),
        (l) => new BadRequestException('auth failed', l),
      );

      logger('got google oauth response', oauthRes);

      const user = getRightOrThrow(
        await this.userService.findOrCreateWithGoogleOAuth(oauthRes),
        /**
         * objectOrError: string => { message: objectOrError }
         * objectOrError: string, error:
         * @returns {BadRequestException}
         */
        (l) => new BadRequestException('auth failed', l),
      );

      logger('user authed', user);

      return { jwtToken: await this.userService.createJwtTokenForUser(user) };
    }
    throw new BadRequestException();
  }

  @Post('email/signup')
  @HttpCode(201)
  @Header('Cache-Control', 'private;max-age=0;')
  async doEmailSignUp(@Body() payload: EmailAuthPayload): Promise<AuthSuccessRes> {
    // this.validateEmailAuthPaylod(payload);

    const created = getRightOrThrow(
      await this.userService.signUpWithEmail(payload.email, payload.password),
      (l) => new BadRequestException('error signing up', l),
    );

    return this.resolveAuthSuccess(created);
  }

  @Post('email/signin')
  @HttpCode(200)
  @Header('Cache-Control', 'private;max-age=0;')
  async doEmailSignIn(@Body() payload: EmailAuthPayload): Promise<AuthSuccessRes> {
    // this.validateEmailAuthPaylod(payload);

    const authedUser = getRightOrThrow(
      await this.userService.signInWithEmail(payload.email, payload.password),
      (l) => new BadRequestException('error logging in', l),
    );

    return this.resolveAuthSuccess(authedUser);
  }

  @Post('jwt/refresh')
  @HttpCode(201)
  @Header('Cache-Control', 'private;max-age=0;')
  async doRefreshToken(@AuthedUser() authedUser: UserAccount): Promise<AuthSuccessRes> {
    return this.resolveAuthSuccess(authedUser);
  }

  private async resolveAuthSuccess(authedUser: UserAccount): Promise<AuthSuccessRes> {
    return {
      jwtToken: await this.userService.createJwtTokenForUser(authedUser),
      user: await this.userService.resolveUser(authedUser),
    };
  }

  private validateEmailAuthPaylod(payload?: EmailAuthPayload) {
    // FIXME: move validate here
    if (!(Sanitize.isString(payload?.email) && Sanitize.isString(payload?.password))) {
      throw new BadRequestException();
    }
  }
}
