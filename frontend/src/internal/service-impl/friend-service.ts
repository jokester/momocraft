import { FriendService } from '../../service/friend-service';
import { AuthServiceImpl } from './auth-service';
import { ApiClient } from './client';
import { ApiResponse } from '../../service/api-convention';
import { FriendUser, UserFriendCollection } from '../../model/friend';
import {
  FriendListResBody,
  ResolvedFriendCollectionsResBody,
  SaveFriendResBody,
  UserFriendRequestPayload,
} from '../../api/momo-api';
import { map } from 'fp-ts/lib/Either';

export class FriendServiceImpl implements FriendService {
  constructor(private readonly authService: AuthServiceImpl, private client: ApiClient) {}

  fetchFriendList(): ApiResponse<FriendUser[]> {
    return this.authService.withAuthedIdentity((currentUser, authHeader) =>
      this.client
        .getJson<FriendListResBody>(this.client.route.momo.user.collection(currentUser.userId), authHeader)
        .then(res => map((body: FriendListResBody) => body.friends)(res)),
    );
  }

  saveFriend(payload: UserFriendRequestPayload): ApiResponse<FriendUser> {
    return this.authService.withAuthedIdentity((currentUser, authHeader) =>
      this.client
        .putJson<SaveFriendResBody>(this.client.route.momo.user.friends(currentUser.userId), authHeader, payload)
        .then(res => map((body: SaveFriendResBody) => body.friend)(res)),
    );
  }

  resolveFriendCollections(): ApiResponse<UserFriendCollection[]> {
    return this.authService
      .withAuthedIdentity((currentUser, authHeader) =>
        this.client.getJson<ResolvedFriendCollectionsResBody>(
          this.client.route.momo.user.friendCollections(currentUser.userId),
          authHeader,
        ),
      )
      .then(res => map((body: ResolvedFriendCollectionsResBody) => body.friendCollections)(res));
  }
}
