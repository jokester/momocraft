import { Either } from 'fp-ts/lib/Either';
import { FriendEntry, FriendInventory } from '../model/friend';

export type ApiResponse<T> = Promise<ApiResponseSync<T>>;
export type ApiResponseSync<T> = Either<string, T>;

export interface FriendService {
  fetchFriendList(): ApiResponse<FriendEntry[]>;
  fetchFriend(userId: string): ApiResponse<FriendEntry>;
  requestFriend(friendUserIdOrEmail: string): ApiResponse<FriendEntry>;

  fetchFriendPossessions(): ApiResponse<FriendInventory[]>;

  resolveOwnWish(): ApiResponse<FriendInventory[]>;
  resolveFriendWish(): ApiResponse<FriendInventory[]>;
}

export const dummyAuthState = {
  user: undefined,
  profile: null,
  pendingAuth: false,
} as const;
