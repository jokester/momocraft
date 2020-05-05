import { ItemCollectionEntry } from '../model/collection';
import { FriendUser, UserFriendCollection } from '../model/friend';

export interface CollectionResBody {
  collections: ItemCollectionEntry[];
}

export interface ResolvedFriendCollectionsResBody {
  friendCollections: UserFriendCollection[];
}

export interface FriendListResBody {
  friends: FriendUser[]
}
export interface SaveFriendResBody {
  friend: FriendUser
}

export interface UserFriendRequestPayload {
  targetUserOrEmail: string;
  comment: string;
  requestMessage: string;
}
