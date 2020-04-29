import { SelfUser } from '../model/user-identity';
import { Either } from 'fp-ts/lib/Either';
import { ItemPossession } from '../model/item-possession';
import { FriendEntry, FriendInventory } from '../model/friend';
import { Observable } from 'rxjs';
import { EmailAuthPayload } from '../model/http-api';

export type ApiResponse<T> = Promise<ApiResponseSync<T>>;

export type ApiResponseSync<T> = Either<string, T>;

export interface UserAuthService {
  authed: Observable<ExposedAuthState>;
  emailSignUp(param: EmailAuthPayload): ApiResponse<SelfUser>;
  emailSignIn(param: EmailAuthPayload): ApiResponse<SelfUser>;
  signOut(): Either<string, void>;
}

export interface PossessionService {
  savePossession(changes: ItemPossession[]): ApiResponse<void>;
  fetchPossession(): ApiResponse<ItemPossession[]>;
}

export interface FriendService {
  fetchFriendList(): ApiResponse<FriendEntry[]>;
  fetchFriend(userId: string): ApiResponse<FriendEntry>;
  requestFriend(friendUserIdOrEmail: string): ApiResponse<FriendEntry>;

  fetchFriendPossessions(): ApiResponse<FriendInventory[]>;

  resolveOwnWish(): ApiResponse<FriendInventory[]>;
  resolveFriendWish(): ApiResponse<FriendInventory[]>;
}

export interface ExposedAuthState {
  self: SelfUser | null;
  pendingAuth: boolean;
}

export const dummyAuthState = {
  self: null,
  pendingAuth: false,
} as const;
