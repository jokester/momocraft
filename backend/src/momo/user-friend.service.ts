import { Inject, Injectable } from '@nestjs/common';
import { TypeORMConnection } from '../db/typeorm-connection.provider';
import { Connection } from 'typeorm';
import { UserAccount } from '../db/entities/user-account';
import { UserFriendRequest } from '../db/entities/user-friend-request';
import { TypeORMUtils } from '../util/typeorm-upsert';
import gravatarUrl from 'gravatar-url';
import { FriendUserDto } from '../model/friends.dto';

@Injectable()
export class UserFriendService {
  constructor(@Inject(TypeORMConnection) private conn: Connection) {}

  async listFriend(ofUser: UserAccount): Promise<UserFriendRequest[]> {
    return await this.conn.getRepository(UserFriendRequest).find({ fromUser: ofUser });
  }

  async listMutualFriends(one: UserAccount): Promise<UserAccount[]> {
    const friends = await this.conn
      .getRepository(UserFriendRequest)
      .createQueryBuilder()
      .select()
      .where('"fromUserId" = :uid', { uid: one.internalUserId })
      .orWhere('"toUserId" = :uid', { uid: one.internalUserId })
      .getMany();
    return [];
  }

  async saveUserFriendRequest(
    requester: UserAccount,
    target: UserAccount,
    payload: { comment: string; requestMessage: string },
  ): Promise<UserFriendRequest> {
    const newEntry = new UserFriendRequest({
      fromUser: requester,
      toUser: target,
      approved: /* FIXME: false by default */ true,
      comment: payload.comment,
    });

    const saved = await TypeORMUtils.upsert(
      this.conn,
      UserFriendRequest,
      [newEntry],
      [
        `
        ON CONSTRAINT "UQ_b7716dbedc42a0e559d32067259"
        DO UPDATE SET "comment" = EXCLUDED."comment", "updatedAt" = EXCLUDED."updatedAt"
    `,
      ],
    );

    return this.conn
      .getRepository(UserFriendRequest)
      .findOneOrFail({ userFriendRequestId: saved[0].userFriendRequestId });
  }
}

export const transform = {
  friend(request: UserFriendRequest): FriendUserDto {
    return {
      userId: request.toUser.userId,
      comment: request.comment,
      avatarUrl: gravatarUrl(request.toUser.emailId, { size: 200 }),
      approvedAt: request.updatedAt.getTime(),
    };
  },
} as const;
