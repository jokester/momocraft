import { BadRequestException, Body, Controller, Header, HttpCode, Post, Request } from '@nestjs/common';
import { getDebugLogger } from '../util/get-debug-logger';
import { GoogleOAuthService } from './google-oauth.service';
import { UserService } from './user.service';
import { getRightOrThrow } from '../util/fpts-getter';

const logger = getDebugLogger(__filename);

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
}
