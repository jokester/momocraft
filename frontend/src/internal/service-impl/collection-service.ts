import { CollectionService } from '../../service/collection-service';
import { ItemCollectionEntry } from '../../model/collection';
import { ApiResponse } from '../../service/api-convention';
import { Observable } from 'rxjs';
import { AuthServiceImpl } from './auth-service';
import { ApiClient } from './client';
import { map } from 'fp-ts/lib/Either';
import { CollectionResBody } from '../../api/momo-api';

const mappers = {
  unResObject: map((resBody: CollectionResBody) => resBody.collections),
} as const;

export class CollectionServiceImpl implements CollectionService {
  constructor(private auth: AuthServiceImpl, private readonly apiClient: ApiClient) {}

  saveCollections(collections: ItemCollectionEntry[]): ApiResponse<ItemCollectionEntry[]> {
    return this.auth
      .withAuthedIdentity((user, authHeader) =>
        this.apiClient.putJson<CollectionResBody>(this.apiClient.route.momo.user.collection(user.userId), authHeader, {
          collections,
        }),
      )
      .then(mappers.unResObject);
  }
  fetchCollections(): ApiResponse<ItemCollectionEntry[]> {
    return this.auth
      .withAuthedIdentity((user, authHeader) =>
        this.apiClient.getJson<CollectionResBody>(this.apiClient.route.momo.user.collection(user.userId), authHeader),
      )
      .then(mappers.unResObject);
  }
  observeCollections(itemName: string): Observable<{}> {
    throw 'todo';
  }
}
