import express from 'express';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { UserEntity } from '../entity/user.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getDebugLogger } from '../util/get-debug-logger';

const logger = getDebugLogger(__filename);

/**
 * @deprecated too hard to get this right with passport
 */
@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: 'FILL ME',
      clientSecret: 'FILL_ME',
      callbackURL: 'FILL_ME', // TODO: this should be param in code
      passReqToCallback: true,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<UserEntity> {
    logger('%s / %s / %O', accessToken, refreshToken, profile);

    throw new InternalServerErrorException('something is wrong');
  }

  authenticate(req: express.Request, options?: any): void {
    logger('req: %O', req);
    logger('options: %O', options);
    super.authenticate(req, options);
  }

  authorizationParams(options: any): object {
    logger('params: %O');
    return super.authorizationParams(options);
  }
}

export const GoogleOAuthGuard = AuthGuard('google');
