import { ItemCollectionEntry } from './collection';

export interface FriendUser {
  userId: string;
  comment: string;
  avatarUrl?: string;
  approvedAt: number;
}

export interface UserFriendCollection {
  friend: FriendUser;
  friendCollections: ItemCollectionEntry[];
}
