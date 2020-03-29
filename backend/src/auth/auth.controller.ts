import { BadRequestException, Body, Controller, Post, Request } from '@nestjs/common';
import { getDebugLogger } from '../util/get-debug-logger';
import { GoogleOAuthService } from './google-oauth.service';
import { UserService } from '../user/user.service';
import { isLeft, isRight } from 'fp-ts/lib/Either';

const logger = getDebugLogger(__filename);

@Controller('auth')
export class AuthController {
  constructor(private readonly googleOAuthService: GoogleOAuthService, private readonly userService: UserService) {}

  @Post('oauth/google')
  async doGoogleOAuth(
    @Request() req: Request,
    @Body() payload: { code: string; redirectUrl: string },
    // eslint-disable-next-line @typescript-eslint/camelcase
  ): Promise<{ jwtToken: string }> {
    if (payload && payload.code && payload.redirectUrl) {
      const x = await this.googleOAuthService.auth(payload.code, payload.redirectUrl);

      logger('got auth', x);
      if (isLeft(x)) {
        throw new BadRequestException('eeee', 'ffff');
      }

      const user = await this.userService.findOrCreateWithGoogleOAuth(x.right);

      logger('user authed', user);

      if (isRight(user)) {
        return { jwtToken: await this.userService.createJwtTokenForUser(user.right) };
      }
    }
    throw new BadRequestException();
  }
}
