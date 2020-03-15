import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entity/user.entity';
import { getDebugLogger } from '../util/get-debug-logger';
import { Either, left } from 'fp-ts/lib/Either';
import { GoogleOAuthResponse } from '../auth/google-oauth.service';

const logger = getDebugLogger(__filename);

@Injectable()
export class UserService {
  constructor() {
    logger('created');
  }

  async findOrCreateWithGoogleOAuth(oauthResponse: GoogleOAuthResponse): Promise<Either<string, UserEntity>> {
    return left('todo');
  }

  async now() {}
}
