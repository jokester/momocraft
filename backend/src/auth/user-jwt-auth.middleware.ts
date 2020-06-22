import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { getDebugLogger } from '../util/get-debug-logger';
import { getRightOrThrow } from '../util/fpts-getter';
import { UserAccount } from '../db/entities/user-account';
import { ErrorCodeEnum } from '../const/error-code';

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
        throw new BadRequestException();
      }
      const user = getRightOrThrow(
        await this.userService.findUserWithJwtToken(jwtToken),
        (l) => new UnauthorizedException('auth required', l),
      );
      (req as any).authedUser = user;
    }

    next();
  }
}

export const AuthedUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const { authedUser } = ctx.switchToHttp().getRequest<{ authedUser?: UserAccount }>();
  if (!authedUser) {
    throw new UnauthorizedException('auth required', ErrorCodeEnum.notAuthenticated);
  }
  return authedUser;
});
