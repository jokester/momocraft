import { SelfUser } from '../model/user-identity';
import { Either } from 'fp-ts/lib/Either';
import { ItemPossession, PossessionState } from '../model/item-possession';
import { FriendEntry, FriendInventory } from '../model/friend';

type ApiResponse<T> = Promise<Either<string, T>>;

export interface UserAuthService {
  signUp(email: string, initialPasswd: string): ApiResponse<SelfUser>;
  authWithEmail(email: string, passwd: string): ApiResponse<SelfUser>;
  getCachedAuthToken(): Either</* error */ string, /* authToken */ string>;
}

export interface PossessionService {
  addPossession(authToken: string, changes: ItemPossession[]): ApiResponse<void>;
  fetchPossession(authTokeN: string): ApiResponse<ItemPossession[]>;
}

export interface FriendService {
  fetchFriendList(authToken: string): ApiResponse<FriendEntry[]>;
  fetchFriend(authToken: string, userId: string): ApiResponse<FriendEntry>;
  requestFriend(authToken: string, friendUserIdOrEmail: string): ApiResponse<FriendEntry>;

  fetchFriendPossessions(authToken: string): ApiResponse<FriendInventory[]>;

  resolveOwnWish(authToken: string): ApiResponse<FriendInventory[]>;
  resolveFriendWish(authToken: string): ApiResponse<FriendInventory[]>;
}
