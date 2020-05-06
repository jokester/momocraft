import { ApiResponse } from './api-convention';
import { UserFriendRequestPayload } from '../api/momo-api';
import { FriendUser, UserFriendCollection } from '../model/friend';

export interface ResolvedFriendCollections {
  friendsOwns: UserFriendCollection[];
  friendWants: UserFriendCollection[];
}

export interface FriendService {
  fetchFriendList(): ApiResponse<FriendUser[]>;

  saveFriend(payload: UserFriendRequestPayload): ApiResponse<FriendUser>;

  resolveFriendCollections(): ApiResponse<ResolvedFriendCollections>;
}
