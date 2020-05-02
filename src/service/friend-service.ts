import { FriendEntry, FriendInventory } from '../model/friend';
import { ApiResponse } from './api-convention';

export interface FriendService {
  fetchFriendList(): ApiResponse<FriendEntry[]>;

  fetchFriend(userId: string): ApiResponse<FriendEntry>;

  requestFriend(friendUserIdOrEmail: string): ApiResponse<FriendEntry>;

  fetchFriendPossessions(): ApiResponse<FriendInventory[]>;

  resolveOwnWish(): ApiResponse<FriendInventory[]>;

  resolveFriendWish(): ApiResponse<FriendInventory[]>;
}
