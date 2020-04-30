import { CollectionState } from './collection';

export interface FriendEntry {
  userId: string;
  approvedByMe: boolean;
  approvedByOther: boolean;
}

export interface FriendInventory {
  userId: string;
  possession: CollectionState;
}
