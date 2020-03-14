import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entity/user.entity';
import { getDebugLogger } from '../util/get-debug-logger';
import { PgDatabaseService } from './pg-database.service';
import { Either, left } from 'fp-ts/lib/Either';
import { GoogleOAuthResponse } from '../auth/google-oauth.service';

const logger = getDebugLogger(__filename);

@Injectable()
export class UserService {
  constructor(private readonly pgDatabaseService: PgDatabaseService) {
    logger('created');
  }

  async findOrCreateWithGoogleOAuth(oauthResponse: GoogleOAuthResponse): Promise<Either<string, UserEntity>> {
    return left('todo');
  }

  async now() {
    const { rows } = await this.pgDatabaseService.query<{ now: Date }>('SELECT NOW()');
    logger('query()', rows);
  }
}
