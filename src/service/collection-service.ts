import { CollectionItem, CollectionState } from '../model/collection';
import { ApiResponse } from './api-convention';

interface CollectionUpdate {
  itemName: string;
  localState: CollectionState;
  serverState: CollectionState;
}

export interface CollectionService {
  saveCollections(changes: CollectionItem[]): ApiResponse<CollectionItem[]>;
  fetchCollections(): ApiResponse<CollectionItem[]>;
  // hard to get this performant?
  // observeCollections(itemName: string): Observable<{}>;
}
