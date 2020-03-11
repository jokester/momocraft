import { BadRequestException, Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from '../entity/user.entity';
import { LocalStrategyGuard } from './local.strategy';
import { getDebugLogger } from '../util/get-debug-logger';
import { GoogleOAuthService } from './google-oauth.service';
import { UserService } from '../user/user.service';

const logger = getDebugLogger(__filename);

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleOAuthService: GoogleOAuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalStrategyGuard)
  @Post('email/signin')
  async emailSignIn(@Request() req: Request & { user?: UserEntity }): Promise<UserEntity | null> {
    logger('got email user: %o', req.user);
    return req.user || null;
  }

  @Get('google/oauth' /* ?code=callback_code... */)
  async startGoogleOAuth(@Request() req: Request & { user?: UserEntity }) {
    logger('got google/oauth user: %o', req.user);
    return null;
  }

  @Get('ping')
  async pingDb() {
    await this.userService.now();
    return null;
  }

  @Post('oauth/google')
  async doGoogleOAuth(@Request() req: Request, @Body() payload2: { code: string; callbackUri: string }) {
    // const payload: { code: string; callbackUri: string } = await req.json();

    const payload = payload2;
    if (payload && payload.code) {
      const x = await this.googleOAuthService.auth(payload.code);

      logger('got auth', x);
      return x;
    }
    throw new BadRequestException();
  }
}
