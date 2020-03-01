import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from '../entity/user.entity';
import { LocalStrategyGuard } from './local.strategy';
import { GoogleOAuthGuard } from './google-oauth.strategy';
import { getDebugLogger } from '../util/get-debug-logger';

const logger = getDebugLogger(__filename);

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalStrategyGuard)
  @Post('email/signin')
  async emailSignIn(@Request() req: Request & { user?: UserEntity }): Promise<UserEntity | null> {
    logger('got email user: %o', req.user);
    return req.user || null;
  }

  @UseGuards(GoogleOAuthGuard)
  @Get('google/oauth' /* ?code=callback_code... */)
  async startGoogleOAuth(@Request() req: Request & { user?: UserEntity }) {
    logger('got google/oauth user: %o', req.user);
    return null;
  }
}
