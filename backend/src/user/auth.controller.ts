import { BadRequestException, Body, Controller, Get, Header, HttpCode, Post, Request } from '@nestjs/common';
import { getDebugLogger } from '../util/get-debug-logger';
import { GoogleOAuthService } from './google-oauth.service';
import { UserService } from './user.service';
import { getRightOrThrow } from '../util/fpts-getter';
import { Sanitize } from '../util/input-santinizer';
import { UserAccount } from '../db/entities/user-account';
import { AuthedUser } from './user-jwt-auth.middleware';
import { AuthedSessionDto, OAuthGoogleRequestDto, EmailAuthRequestDto, OAuthRequestDto } from '../model/auth.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { UserProfileDto } from '../model/user-profile.dto';
import { ApiErrorDto } from '../model/api-error.dto';
import { DiscordOauthService } from './discord-oauth.service';

const logger = getDebugLogger(__filename);

export interface AuthSuccessRes {
  jwtToken: string;
  user: UserProfileDto;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly googleOAuthService: GoogleOAuthService,
    private readonly discordOauthService: DiscordOauthService,
    private readonly userService: UserService,
  ) {}

  @Post('oauth/google')
  @Header('Cache-Control', 'private;max-age=0;')
  @ApiCreatedResponse({ type: AuthedSessionDto })
  async doGoogleOAuth(
    @Request() req: Request,
    @Body() payload: OAuthGoogleRequestDto,
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

  @Post('oauth/discord')
  @Header('Cache-Control', 'private;max-age=0;')
  @ApiCreatedResponse({ type: AuthedSessionDto })
  async doDiscordOAuth(@Body() payload: OAuthRequestDto): Promise<AuthedSessionDto> {
    const authedUser = getRightOrThrow(
      await this.discordOauthService.attemptAuth(payload.code, payload.redirectUrl),
      (l) => new BadRequestException('oauth fail', l),
    );

    return this.issueAuthSuccessResponse(authedUser);
  }

  @Post('email/signup')
  @Header('Cache-Control', 'private;max-age=0;')
  @ApiCreatedResponse({ type: AuthedSessionDto })
  async doEmailSignUp(@Body() payload: EmailAuthRequestDto): Promise<AuthSuccessRes> {
    // this.validateEmailAuthPaylod(payload);

    const created = getRightOrThrow(
      await this.userService.signUpWithEmail(payload.email, payload.password),
      (l) => new BadRequestException('error signing up', l),
    );

    return this.issueAuthSuccessResponse(created);
  }

  @Post('email/signin')
  @HttpCode(200)
  @Header('Cache-Control', 'private;max-age=0;')
  @ApiOkResponse({ type: AuthedSessionDto })
  async doEmailSignIn(@Body() payload: EmailAuthRequestDto): Promise<AuthSuccessRes> {
    // this.validateEmailAuthPaylod(payload);

    const authedUser = getRightOrThrow(
      await this.userService.signInWithEmail(payload.email, payload.password),
      (l) => new BadRequestException('error logging in', l),
    );

    return this.issueAuthSuccessResponse(authedUser);
  }

  @Post('jwt/refresh')
  @Header('Cache-Control', 'private;max-age=0;')
  @HttpCode(201)
  @ApiCreatedResponse({ type: AuthedSessionDto })
  async doRefreshToken(@AuthedUser() authedUser: UserAccount): Promise<AuthSuccessRes> {
    return this.issueAuthSuccessResponse(authedUser);
  }

  @Get('dummy/do-not-call')
  @ApiOkResponse({ type: ApiErrorDto })
  async dummyDoNotCall(): Promise<ApiErrorDto> {
    return { statusCode: 200, message: 'MSG', error: 'ERR' };
  }

  private async issueAuthSuccessResponse(authedUser: UserAccount): Promise<AuthSuccessRes> {
    return {
      jwtToken: await this.userService.createJwtTokenForUser(authedUser),
      user: await this.userService.resolveUser(authedUser),
    };
  }

  private validateEmailAuthPaylod(payload?: EmailAuthRequestDto) {
    // FIXME: move validate here
    if (!(Sanitize.isString(payload?.email) && Sanitize.isString(payload?.password))) {
      throw new BadRequestException();
    }
  }
}
