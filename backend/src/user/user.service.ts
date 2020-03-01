import { Injectable } from '@nestjs/common';
import { Option, Some, None, none } from 'fp-ts/lib/Option';
import { UserEntity } from '../entity/user.entity';
import { getDebugLogger } from '../util/get-debug-logger';

@Injectable()
export class UserService {
  constructor() {
    getDebugLogger(__filename)('created');
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
}
