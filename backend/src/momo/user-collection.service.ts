import { Inject, Injectable } from '@nestjs/common';
import { TypeORMConnection } from '../db/typeorm-connection.provider';
import { Connection } from 'typeorm';
import { UserAccount } from '../db/entities/user-account';
import { CollectionState, ItemCollectionEntry } from '../linked-frontend/model/collection';
import { UserItemCollection } from '../db/entities/user-item-collection';

@Injectable()
export class UserCollectionService {
  constructor(@Inject(TypeORMConnection) private conn: Connection) {}

  async updateCollection(user: UserAccount, entries: ItemCollectionEntry[]): Promise<ItemCollectionEntry[]> {
    const toSave = entries.map(
      _ =>
        new UserItemCollection({
          userId: user.userId,
          itemId: _.itemId,
          itemState: _.state,
        }),
    );

    const saved = await this.conn.getRepository(UserItemCollection).save(toSave);

    return saved.map(_ => ({ state: _.itemState as CollectionState, itemId: _.itemId }));
  }

  async findByUser(user: UserAccount): Promise<ItemCollectionEntry[]> {
    const found = await this.conn.getRepository(UserItemCollection).find({ userId: user.userId });

    return found.map(_ => ({ state: _.itemState as CollectionState, itemId: _.itemId }));
  }
}
