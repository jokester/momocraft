import { SelfUser } from '../model/user-identity';
import { Either } from 'fp-ts/lib/Either';
import { ItemPossession, } from '../model/item-possession';
import { FriendEntry, FriendInventory } from '../model/friend';
import { Observable } from "rxjs";
import { Option } from "fp-ts/lib/Option";

type ApiResponse<T> = Promise<Either<string, T>>;

export interface EmailAuthPayload {
  email: string;
  password: string;
}

export interface UserAuthService {
  authed: Observable<Option<SelfUser>>
  emailSignUp(param: EmailAuthPayload): ApiResponse<SelfUser>;
  emailSignIn(param: EmailAuthPayload): ApiResponse<SelfUser>;
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
