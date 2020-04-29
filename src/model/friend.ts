import { PossessionState } from './item-possession';

export interface FriendEntry {
  userId: string;
  approvedByMe: boolean;
  approvedByOther: boolean;
}

export interface FriendInventory {
  userId: string;
  possession: PossessionState;
}
