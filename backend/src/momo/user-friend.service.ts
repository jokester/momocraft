import { Inject, Injectable } from '@nestjs/common';
import { TypeORMConnection } from '../db/typeorm-connection.provider';
import { Connection, getRepository } from 'typeorm';
import { UserAccount } from '../db/entities/user-account';
import { UserFriendRequest } from '../db/entities/user-friend-request';
import { TypeORMUtils } from '../util/typeorm-upsert';

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

  async requestUserFriend(
    requester: UserAccount,
    target: UserAccount,
    payload: { comment: string },
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
        ON CONSTRAINT "UQ_3ac1e0cf9e7ac33511f4c8d54bb"
        DO UPDATE SET "comment" = EXCLUDED."comment", "updatedAt" = EXCLUDED."updatedAt"
    `,
      ],
    );

    return saved[0];
  }
}
