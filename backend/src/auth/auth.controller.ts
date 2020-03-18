import { BadRequestException, Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { getDebugLogger } from '../util/get-debug-logger';
import { GoogleOAuthService } from './google-oauth.service';
import { UserService } from '../user/user.service';
import { oauth2_v1 as GoogleOAuth2V1 } from 'googleapis';
import { isLeft, isRight } from 'fp-ts/lib/Either';

const logger = getDebugLogger(__filename);

@Controller('auth')
export class AuthController {
  constructor(private readonly googleOAuthService: GoogleOAuthService, private readonly userService: UserService) {}

  @Get('ping')
  async pingDb() {
    await this.userService.now();
    return null;
  }

  @Post('oauth/google')
  async doGoogleOAuth(
    @Request() req: Request,
    @Body() payload: { code: string; redirectUrl: string },
    // eslint-disable-next-line @typescript-eslint/camelcase
  ): Promise<GoogleOAuth2V1.Schema$Userinfoplus> {
    if (payload && payload.code && payload.redirectUrl) {
      const x = await this.googleOAuthService.auth(payload.code, payload.redirectUrl);

      logger('got auth', x);
      if (isLeft(x)) {
        throw new BadRequestException('eeee', 'ffff');
      }

      const user = this.userService.findOrCreateWithGoogleOAuth(x.right);

      logger('user authed', user);

      return x.right.userInfo;
    }
    throw new BadRequestException();
  }
}
