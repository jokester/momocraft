import { ApiResponse } from './api-convention';
import { UserFriendRequestPayload } from '../api/momo-api';
import { FriendUser, UserFriendCollection } from '../model/friend';

export interface FriendService {
  fetchFriendList(): ApiResponse<FriendUser[]>;

  saveFriend(payload: UserFriendRequestPayload): ApiResponse<UserFriendCollection>;

  resolveFriendCollections(): ApiResponse<UserFriendCollection[]>;
}
