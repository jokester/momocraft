import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { UserEntity } from '../entity/user.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getDebugLogger } from '../util/get-debug-logger';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: 'FILL ME',
      clientSecret: 'FILL_ME',
      scope: ['profile', 'email'],
      callbackURL: 'FILL_ME', // have to match the one retrieved code?
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<UserEntity> {
    getDebugLogger(__filename)('%s / %s / %O', accessToken, refreshToken, profile);

    throw new InternalServerErrorException('something is wrong');
  }
}

export const GoogleOAuthGuard = AuthGuard('google');
