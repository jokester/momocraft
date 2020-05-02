import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { getDebugLogger } from '../util/get-debug-logger';
import { getRightOrThrow } from '../util/fpts-getter';
import { UserAccount } from '../db/entities/user-account';

const logger = getDebugLogger(__filename);

/**
 * @class UserJwtAuthMiddleware
 * @desc attach authorized user id to {@link Request} object
 */
@Injectable()
export class UserJwtAuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: () => void): Promise<void> {
    const authHeader = req.header('Authorization');
    logger('running', authHeader);

    if (authHeader) {
      const [_whatever, jwtToken] = /^Bearer ([^ ]*)$/.exec(authHeader) || [];

      if (!jwtToken) {
        throw new BadRequestException('malformed Authorization header');
      }
      const user = getRightOrThrow(
        await this.userService.findUserWithJwtToken(jwtToken),
        l => new UnauthorizedException(l),
      );
      (req as any).authedUser = user;
    }

    next();
  }
}

export const AuthedUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const { authedUser } = ctx.switchToHttp().getRequest<{ authedUser?: UserAccount }>();
  if (!authedUser) {
    throw new UnauthorizedException();
  }
  return authedUser;
});
