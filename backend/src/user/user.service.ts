import { Injectable } from '@nestjs/common';
import { Option, Some, None, none } from 'fp-ts/lib/Option';
import { UserEntity } from '../entity/user.entity';
import { getDebugLogger } from '../util/get-debug-logger';
import { PgDatabaseService } from './pg-database.service';

const logger = getDebugLogger(__filename);

@Injectable()
export class UserService {
  constructor(private readonly pgDatabaseService: PgDatabaseService) {
    logger('created');
  }
  async findUserWithEmail(email: string): Promise<Option<UserEntity>> {
    if (email === 'a@b.com') {
      return new Some(
        new UserEntity({
          userId: 1,
          email: 'a@b.com',
          passwordHash: 'hashed potato',
        }),
      );
    }

    return none;
  }

  async now() {
    const { rows } = await this.pgDatabaseService.query<{ now: Date }>('SELECT NOW()');
    logger('query()', rows);
  }
}
