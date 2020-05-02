import { Inject, Injectable } from '@nestjs/common';
import { TypeORMConnection } from '../db/typeorm-connection.provider';
import { Connection } from 'typeorm';
import { EntropyService } from '../deps/entropy.service';
import { UserAccount } from '../db/entities/user-account';
import { ItemCollectionEntry } from '../linked-frontend/model/collection';
import { UserItemCollection } from '../db/entities/user-item-collection';

@Injectable()
export class CollectionService {
  constructor(@Inject(TypeORMConnection) private conn: Connection, private entropy: EntropyService) {}

  async updateCollection(user: UserAccount, entries: ItemCollectionEntry[]) {
    const toSave = entries.map(
      _ =>
        new UserItemCollection({
          userId: user.userId,
          itemId: _.itemId,
          itemState: _.state,
        }),
    );
  }
}
