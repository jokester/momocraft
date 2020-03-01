import { Injectable } from '@nestjs/common';
import { getDebugLogger } from '../util/get-debug-logger';
import { UserService } from '../user/user.service';
import { Option } from 'fp-ts/lib/Option';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {
    getDebugLogger(__filename)('authService created with %o', userService);
  }

  async authUserWithPassword(email: string, password: string): Promise<Option<UserEntity>> {
    const user = await this.userService.findUserWithEmail(email);

    return user.filter(_ => _.passwordHash === password);
  }

  touch() {
    getDebugLogger(__filename)('authService touched');
  }
}
