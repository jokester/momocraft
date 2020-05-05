import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Headers,
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
import { CollectionResBody, UserFriendRequestPayload } from '../linked-frontend/api/momo-api';
import { UserCollectionService } from './user-collection.service';
import { ErrorCodeEnum } from '../linked-frontend/model/error-code';
import * as Either from 'fp-ts/lib/Either';
import { getOrElse } from 'fp-ts/lib/Either';
import { UserFriendService } from './user-friend.service';
import gravatarUrl from 'gravatar-url';
import { UserFriendRequest } from '../db/entities/user-friend-request';
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
      () => new BadRequestException('user not found', ErrorCodeEnum.malformedUserId),
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

    const saved = await this.collectionService.updateCollection(authedUser, payload.collections);
    return { collections: saved };
  }

  @Put(':userId/friends')
  @HttpCode(201)
  async saveUserFriendRequest(
    @AuthedUser() currentUser: UserAccount,
    @Param() payload: UserFriendRequestPayload,
  ): Promise<FriendUser> {
    const findByEmail = Either.map((email: string) => ({ emailId: email }))(Sanitize.email(payload.targetUserOrEmail)),
      findByUserId = Either.map((userId: string) => ({ userId }))(Sanitize.userId(payload.targetUserOrEmail));

    const condition = getOrElse<string, { userId: string } | { emailId: string }>(() =>
      getRightOrThrow(findByUserId, () => new BadRequestException()),
    )(findByEmail);

    const target = getSomeOrThrow(
      await this.userService.findUser(condition),
      () => new BadRequestException('user not found'),
    );

    const createOrUpdated = await this.friendService.requestUserFriend(currentUser, target, {
      comment: payload.comment,
    });

    return transform.friend(createOrUpdated);
  }

  @Get(':userId/friends')
  async listFriends(@AuthedUser() currentUser: UserAccount): Promise<FriendUser[]> {
    // const x = await this.friendService.listFriend(currentUser);
    return [];
  }

  @Put('self')
  async putSelfMeta(@AuthedUser() authedUser: UserAccount, @Body() params: {}): Promise<ResolvedUser> {
    logger('UserController#putSelfMeta', authedUser, params);

    const updated = await this.userService.updateUserMeta(authedUser, params);

    return this.userService.resolveUser(updated);
  }
}

const transform = {
  friend(request: UserFriendRequest): FriendUser {
    return {
      userId: request.toUser.userId,
      comment: request.comment,
      avatarUrl: gravatarUrl(request.toUser.emailId, { size: 200 }),
      approvedAt: request.updatedAt.getTime(),
    };
  },
} as const;
