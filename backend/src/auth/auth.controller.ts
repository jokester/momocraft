import { BadRequestException, Body, Controller, Get, Header, HttpCode, Post, Request } from '@nestjs/common';
import { getDebugLogger } from '../util/get-debug-logger';
import { GoogleOAuthService } from '../user/google-oauth.service';
import { UserService } from '../user/user.service';
import { getRightOrThrow } from '../util/fpts-getter';
import { Sanitize } from '../util/input-santinizer';
import { UserAccount } from '../db/entities/user-account';
import { AuthedUser } from './user-jwt-auth.middleware';
import { AuthedSessionDto, EmailAuthRequestDto, OAuthRequestDto } from '../model/auth.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { UserProfileDto } from '../model/user-profile.dto';
import { ApiErrorDto } from '../model/api-error.dto';
import { DiscordOAuthService } from '../user/discord-oauth.service';

const logger = getDebugLogger(__filename);

export interface AuthSuccessRes {
  jwtToken: string;
  user: UserProfileDto;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly googleOAuthService: GoogleOAuthService,
    private readonly discordOauthService: DiscordOAuthService,
    private readonly userService: UserService,
  ) {}

  @Post('oauth/google')
  @Header('Cache-Control', 'private;max-age=0;')
  @ApiCreatedResponse({ type: AuthedSessionDto })
  async doGoogleOAuth(@Body() payload: OAuthRequestDto) {
    if (payload && payload.code && payload.redirectUrl) {
      const authedUser = getRightOrThrow(
        await this.googleOAuthService.attemptAuth(payload),
        (l) => new BadRequestException('auth failed', l),
      );

      return this.issueAuthSuccessResponse(authedUser);
    }
    throw new BadRequestException();
  }

  @Post('oauth/discord')
  @Header('Cache-Control', 'private;max-age=0;')
  @ApiCreatedResponse({ type: AuthedSessionDto })
  async doDiscordOAuth(@Body() payload: OAuthRequestDto): Promise<AuthedSessionDto> {
    if (payload && payload.code && payload.redirectUrl) {
      const authedUser = getRightOrThrow(
        await this.discordOauthService.attemptAuth(payload),
        (l) => new BadRequestException('oauth fail', l),
      );
      return this.issueAuthSuccessResponse(authedUser);
    }

    throw new BadRequestException();
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
}
