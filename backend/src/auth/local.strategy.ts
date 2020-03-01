import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { getDebugLogger } from '../util/get-debug-logger';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
    getDebugLogger(__filename)('gotAuthService: %o', authService);
  }

  async validate(username: string, password: string): Promise<UserEntity> {
    const user = await this.authService.authUserWithPassword(username, password);

    if (user.isSome()) {
      return user.value;
    }
    throw new UnauthorizedException();
  }
}

export const LocalStrategyGuard = AuthGuard('local');
