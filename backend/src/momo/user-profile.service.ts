import { Inject, Injectable } from '@nestjs/common';
import { TypeORMConnection } from '../db/typeorm-connection.provider';
import { Connection } from 'typeorm';
import { UserAccount } from '../db/entities/user-account';
import { UserProfile } from '../db/entities/user-profile';
import { Either, left } from 'fp-ts/lib/Either';

@Injectable()
export class UserProfileService {
  constructor(@Inject(TypeORMConnection) private conn: Connection) {}

  async getUserProfile(userAccount: UserAccount): Promise<Either<string, UserProfile>> {
    return left('');
  }
}
