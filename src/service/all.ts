import { Either } from 'fp-ts/lib/Either';
import { ItemPossession } from '../model/item-possession';
import { FriendEntry, FriendInventory } from '../model/friend';
import { Observable } from 'rxjs';
import { EmailAuthPayload, HankoUser } from '../api/hanko-api';

export type ApiResponse<T> = Promise<ApiResponseSync<T>>;

export type ApiResponseSync<T> = Either<string, T>;

export interface UserAuthService {
  authed: Observable<ExposedAuthState>;
  emailSignUp(param: EmailAuthPayload): ApiResponse<HankoUser>;
  emailSignIn(param: EmailAuthPayload): ApiResponse<HankoUser>;
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
  user?: HankoUser;
  profile: null;
  pendingAuth: boolean;
}

export const dummyAuthState = {
  user: undefined,
  profile: null,
  pendingAuth: false,
} as const;
