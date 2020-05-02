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
import { Sanitize } from '../util/input-santinizer';
import { CollectionResBody } from '../linked-frontend/api/momo-api';

const logger = getDebugLogger(__filename);

@Controller('momo/user')
export class MomoUserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId/collections')
  async getCollections(@Param() params: { userId: string }): Promise<CollectionResBody> {
    logger('UserController#getCollections', params);

    const userId = getRightOrThrow(Sanitize.pass(params?.userId), l => new BadRequestException(l));

    const user = getSomeOrThrow(await this.userService.findUser({ userId }), () => new NotFoundException());

    return { collections: [] };
  }

  @Put(':userId/collections')
  async putCollections(
    @Param() params: { userId: string },
    @AuthedUser() authedUser: UserAccount,
  ): Promise<CollectionResBody> {
    logger('UserController#putCollections', params);

    return { collections: [] };
  }

  @Put('self')
  async putSelfMeta(@AuthedUser() authedUser: UserAccount, @Body() params: {}): Promise<ResolvedUser> {
    logger('UserController#putSelfMeta', authedUser, params);

    const updated = await this.userService.updateUserMeta(authedUser, params);

    return this.userService.resolveUser(updated);
  }
}
