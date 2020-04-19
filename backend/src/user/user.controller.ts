import {
  BadRequestException,
  Controller,
  Get,
  Header,
  Headers,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { ResolvedUser, UserService } from './user.service';
import { getRightOrThrow, getSomeOrThrow } from '../util/fpts-getter';
import { getDebugLogger } from '../util/get-debug-logger';
import { UserAccount } from '../db/entities/user-account';
import { AuthedUser } from './user-jwt-auth.middleware';

const logger = getDebugLogger(__filename);

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('id/:shortId')
  async getUser(@Param() params: { shortId: string }): Promise<ResolvedUser> {
    logger('getUser params', params);

    const user = getSomeOrThrow(await this.userService.findByShortId(params.shortId), () => new NotFoundException());

    return this.userService.resolveUser(user);
  }

  @Get('self')
  @Header('Cache-Control', 'private;max-age=0;')
  async getSelf(@AuthedUser() authedUser: UserAccount): Promise<ResolvedUser> {
    logger('AuthController#jwtValidate auth', authedUser);

    return this.userService.resolveUser(authedUser);
  }

  @Put('self')
  async putUserMeta(@Param() params: {}) {
    throw 'TODO';
  }
}
