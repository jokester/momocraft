import { AuthServiceImpl } from './auth-service';
import { ApiConvention, ApiResponse } from '../api/api-convention';
import { map } from 'fp-ts/lib/Either';
import { createLogger } from '../util/debug-logger';
import { CollectionServiceImpl } from './collection-service';
import { MapsExtra } from '../util/MapsExtra';
import { ApiProvider } from '../api/bind-api';
import { launderResponse } from '../api/launder-api-response';
import {
  FriendCollectionsDto,
  FriendUserDto,
  ItemCollectionDto,
  UserFriendCollectionDto,
  UserFriendRequestDto,
  FriendListDto,
} from '../api-generated/models';
import { CollectionState } from '../const/collection';

const logger = createLogger(__filename, true);

export interface ResolvedFriendCollections {
  friendsOwns: UserFriendCollectionDto[];
  friendWants: UserFriendCollectionDto[];
}

const x = {
  unwrapFriendListDto: map((res: FriendListDto) => res.friends),
  unwrapFriendCollectionDto: map((res: FriendCollectionsDto) => res.friendCollections),
} as const;

export class FriendServiceImpl {
  constructor(
    private readonly useApi: ApiProvider,
    private readonly authService: AuthServiceImpl,
    private readonly collectionService: CollectionServiceImpl,
  ) {}

  fetchFriendList(): ApiResponse<FriendUserDto[]> {
    return this.authService
      .withAuthedIdentity((currentUser, authHeader) =>
        launderResponse(this.useApi(authHeader).momoUserControllerListFriendsRaw({ userId: currentUser.userId })),
      )
      .then(x.unwrapFriendListDto);
  }

  saveFriend(payload: UserFriendRequestDto): ApiResponse<FriendUserDto> {
    return this.authService
      .withAuthedIdentity((currentUser, authHeader) =>
        launderResponse(
          this.useApi(authHeader).momoUserControllerSaveUserFriendRequestRaw({
            userId: currentUser.userId,
            userFriendRequestDto: payload,
          }),
        ),
      )
      .then(logger.tap);
  }

  async resolveFriendCollections(): ApiResponse<ResolvedFriendCollections> {
    return this.authService
      .withAuthedIdentity(async (currentUser, authHeader) => {
        const collectionsRes = this.collectionService.fetchOwnCollections();

        const friendsCollectionsRes = launderResponse(
          this.useApi(authHeader).momoUserControllerListFriendCollectionsRaw({ userId: currentUser.userId }),
        ).then(x.unwrapFriendCollectionDto);

        const apiResponse = ApiConvention.multi2(await collectionsRes, await friendsCollectionsRes);

        return map(([myCollection, friendCollections]: [ItemCollectionDto[], UserFriendCollectionDto[]]) => {
          const resolved: ResolvedFriendCollections = {
            friendsOwns: [],
            friendWants: [],
          };

          const myMap = MapsExtra.fromArray(myCollection, (_) => _.itemId);

          friendCollections.forEach((fc) => {
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
