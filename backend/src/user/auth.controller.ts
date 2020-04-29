import { BadRequestException, Body, Controller, Header, HttpCode, Post, Request } from '@nestjs/common';
import { getDebugLogger } from '../util/get-debug-logger';
import { GoogleOAuthService } from './google-oauth.service';
import { ResolvedUser, UserService } from './user.service';
import { getRightOrThrow } from '../util/fpts-getter';
import { EmailAuthPayload } from '../linked-frontend/model/http-api';
import { Sanitize } from '../util/input-santinizer';
import { UserAccount } from '../db/entities/user-account';
import { auth } from 'google-auth-library';

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
        () => new BadRequestException('auth failed'),
      );

      logger('got google oauth response', oauthRes);

      const user = getRightOrThrow(
        await this.userService.findOrCreateWithGoogleOAuth(oauthRes),
        () => new BadRequestException('auth failed'),
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
    this.validateEmailAuthPaylod(payload);

    const created = getRightOrThrow(
      await this.userService.signUpWithEmail(payload.email, payload.password),
      l => new BadRequestException(l),
    );

    return this.resolveAuthSuccess(created);
  }

  @Post('email/signin')
  @HttpCode(200)
  @Header('Cache-Control', 'private;max-age=0;')
  async doEmailSignIn(@Body() payload: EmailAuthPayload): Promise<AuthSuccessRes> {
    this.validateEmailAuthPaylod(payload);

    const authedUser = getRightOrThrow(
      await this.userService.signInWithEmail(payload.email, payload.password),
      l => new BadRequestException('auth fail'),
    );

    return this.resolveAuthSuccess(authedUser);
  }

  private async resolveAuthSuccess(authedUser: UserAccount): Promise<AuthSuccessRes> {
    return {
      jwtToken: await this.userService.createJwtTokenForUser(authedUser),
      user: await this.userService.resolveUser(authedUser),
    };
  }

  private validateEmailAuthPaylod(payload?: EmailAuthPayload) {
    if (!(Sanitize.isString(payload?.email) && Sanitize.isString(payload?.password))) {
      throw new BadRequestException();
    }
  }
}
