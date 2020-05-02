import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Headers,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { ResolvedUser, UserService } from '../user/user.service';
import { getRightOrThrow, getSomeOrThrow } from '../util/fpts-getter';
import { getDebugLogger } from '../util/get-debug-logger';
import { UserAccount } from '../db/entities/user-account';
import { AuthedUser } from '../user/user-jwt-auth.middleware';

const logger = getDebugLogger(__filename);

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('id/:userId')
  async getUser(@Param() params: { userId: string }): Promise<ResolvedUser> {
    logger('UserController#getUser', params);

    const user = getSomeOrThrow(await this.userService.findUser(params), () => new NotFoundException());

    return this.userService.resolveUser(user);
  }

  @Get('self')
  @Header('Cache-Control', 'private;max-age=0;')
  async getSelf(@AuthedUser() authedUser: UserAccount): Promise<ResolvedUser> {
    logger('UserController#getSelf', authedUser);

    return this.userService.resolveUser(authedUser);
  }

  @Put('self')
  async putSelfMeta(@AuthedUser() authedUser: UserAccount, @Body() params: {}): Promise<ResolvedUser> {
    logger('UserController#putSelfMeta', authedUser, params);

    const updated = await this.userService.updateUserMeta(authedUser, params);

    return this.userService.resolveUser(updated);
  }
}
