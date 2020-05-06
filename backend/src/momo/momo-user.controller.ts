import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
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
import {
  CollectionResBody,
  FriendCollectionsResBody,
  FriendListResBody,
  UserFriendRequestPayload,
} from '../linked-frontend/api/momo-api';
import { UserCollectionService } from './user-collection.service';
import { ErrorCodeEnum } from '../linked-frontend/model/error-code';
import * as Either from 'fp-ts/lib/Either';
import { getOrElse } from 'fp-ts/lib/Either';
import { transform, UserFriendService } from './user-friend.service';
import { FriendUser } from '../linked-frontend/model/friend';

const logger = getDebugLogger(__filename);

@Controller('momo/user')
export class MomoUserController {
  constructor(
    private readonly userService: UserService,
    private readonly collectionService: UserCollectionService,
    private readonly friendService: UserFriendService,
  ) {}

  @Get(':userId/collections')
  async getCollections(@Param() params: { userId: string }): Promise<CollectionResBody> {
    logger('UserController#getCollections', params);

    const userId = getRightOrThrow(
      Sanitize.userId(params?.userId),
      l => new BadRequestException('incorrect user id', l),
    );

    const user = getSomeOrThrow(
      await this.userService.findUser({ userId }),
      () => new BadRequestException('user not found', ErrorCodeEnum.userNotFound),
    );
    const found = await this.collectionService.findByUser(user);
    return { collections: found };
  }

  @Put(':userId/collections')
  async putCollections(
    @Param() params: { userId: string },
    @AuthedUser() authedUser: UserAccount,
    @Body() payload: CollectionResBody,
  ): Promise<CollectionResBody> {
    logger('UserController#putCollections', params);

    if (params.userId !== authedUser.userId) {
      throw new UnauthorizedException('userid mismatch', ErrorCodeEnum.notAuthenticated);
    }

    const saved = await this.collectionService.updateCollection(authedUser, payload.collections);
    return { collections: saved };
  }

  @Put(':userId/friends')
  @HttpCode(201)
  async saveUserFriendRequest(
    @Param() params: { userId: string },
    @AuthedUser() authedUser: UserAccount,
    @Body() payload: UserFriendRequestPayload,
  ): Promise<FriendUser> {
    if (params.userId !== authedUser.userId) {
      throw new UnauthorizedException('not authenticated', ErrorCodeEnum.notAuthenticated);
    }

    const findByEmail = Either.map((email: string) => ({ emailId: email }))(Sanitize.email(payload.targetUserOrEmail)),
      findByUserId = Either.map((userId: string) => ({ userId }))(Sanitize.userId(payload.targetUserOrEmail));

    const condition = getOrElse<string, { userId: string } | { emailId: string }>(() =>
      getRightOrThrow(findByUserId, () => new BadRequestException()),
    )(findByEmail);

    const target = getSomeOrThrow(
      await this.userService.findUser(condition),
      () => new NotFoundException('user not found', ErrorCodeEnum.userNotFound),
    );

    logger('saveUserFriendRequest', payload, findByEmail, findByUserId, target);

    const createOrUpdated = await this.friendService.saveUserFriendRequest(authedUser, target, {
      comment: payload.comment,
      requestMessage: payload.requestMessage,
    });

    return transform.friend(createOrUpdated);
  }

  @Get(':userId/friendCollections')
  async listFriendCollections(@Param() params: { userId: string }): Promise<FriendCollectionsResBody> {
    const user = getSomeOrThrow(
      await this.userService.findUser({ userId: params.userId }),
      () => new NotFoundException('user not found', ErrorCodeEnum.userNotFound),
    );

    const friends = await this.friendService.listFriend(user);

    return { friendCollections: await this.collectionService.listFriendCollections(friends) };
  }

  @Get(':userId/friends')
  async listFriends(@AuthedUser() currentUser: UserAccount): Promise<FriendListResBody> {
    const x = await this.friendService.listFriend(currentUser);
    return { friends: x.map(transform.friend) };
  }

  @Put('self')
  async putSelfMeta(@AuthedUser() authedUser: UserAccount, @Body() params: {}): Promise<ResolvedUser> {
    logger('UserController#putSelfMeta', authedUser, params);

    const updated = await this.userService.updateUserMeta(authedUser, params);

    return this.userService.resolveUser(updated);
  }
}
