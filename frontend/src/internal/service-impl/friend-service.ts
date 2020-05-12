import { FriendService, ResolvedFriendCollections } from '../../service/friend-service';
import { AuthServiceImpl } from './auth-service';
import { ApiClient } from './client';
import { ApiConvention, ApiResponse } from '../../service/api-convention';
import { FriendUser } from '../../model/friend';
import { FriendCollectionsResBody, FriendListResBody, UserFriendRequestPayload } from '../../api/momo-api';
import { map } from 'fp-ts/lib/Either';
import { createLogger } from '../../util/debug-logger';
import { CollectionServiceImpl } from './collection-service';
import { CollectionState, ItemCollectionEntry } from '../../model/collection';
import { MapsExtra } from '../../util/MapsExtra';

const logger = createLogger(__filename, true);

export class FriendServiceImpl implements FriendService {
  constructor(
    private readonly authService: AuthServiceImpl,
    private readonly collectionService: CollectionServiceImpl,
    private client: ApiClient,
  ) {}

  fetchFriendList(): ApiResponse<FriendUser[]> {
    return this.authService
      .withAuthedIdentity((currentUser, authHeader) =>
        this.client
          .getJson<FriendListResBody>(this.client.route.momo.user.friends(currentUser.userId), authHeader)
          .then((res) => map((body: FriendListResBody) => body.friends)(res)),
      )
      .then(logger.tap);
  }

  saveFriend(payload: UserFriendRequestPayload): ApiResponse<FriendUser> {
    return this.authService
      .withAuthedIdentity((currentUser, authHeader) =>
        this.client.putJson<FriendUser>(this.client.route.momo.user.friends(currentUser.userId), authHeader, payload),
      )
      .then(logger.tap);
  }

  async resolveFriendCollections(): ApiResponse<ResolvedFriendCollections> {
    return this.authService
      .withAuthedIdentity(async (currentUser, authHeader) => {
        const [collectionsRes, friendsCollectionsRes] = await Promise.all([
          this.collectionService.fetchOwnCollections(),
          this.client.getJson<FriendCollectionsResBody>(
            this.client.route.momo.user.friendCollections(currentUser.userId),
            authHeader,
          ),
        ]);

        const apiResponse = ApiConvention.multi2(collectionsRes, friendsCollectionsRes);

        return map(([myCollection, friendCollections]: [ItemCollectionEntry[], FriendCollectionsResBody]) => {
          const resolved: ResolvedFriendCollections = {
            friendsOwns: [],
            friendWants: [],
          };

          const myMap = MapsExtra.fromArray(myCollection, (_) => _.itemId);

          friendCollections.friendCollections.forEach((fc) => {
            const friendOwnsAndIWant = fc.friendCollections.filter(
              (_) => _.state === CollectionState.own && myMap.get(_.itemId)?.state === CollectionState.want,
            );

            if (friendOwnsAndIWant.length) {
              resolved.friendsOwns.push({ friend: fc.friend, friendCollections: friendOwnsAndIWant });
            }

            const friendWantsAndIOwn = fc.friendCollections.filter(
              (_) => _.state === CollectionState.want && myMap.get(_.itemId)?.state === CollectionState.own,
            );

            if (friendWantsAndIOwn.length) {
              resolved.friendWants.push({ friend: fc.friend, friendCollections: friendWantsAndIOwn });
            }
          });

          return resolved;
        })(apiResponse);
      })
      .then(logger.tap);
  }
}
