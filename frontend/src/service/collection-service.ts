import { ItemCollectionEntry, CollectionState } from '../model/collection';
import { ApiResponse } from './api-convention';

interface CollectionUpdate {
  itemName: string;
  localState: CollectionState;
  serverState: CollectionState;
}

export interface CollectionService {
  saveCollections(changes: ItemCollectionEntry[]): ApiResponse<ItemCollectionEntry[]>;
  fetchCollections(): ApiResponse<ItemCollectionEntry[]>;
  // hard to get this performant?
  // observeCollections(itemName: string): Observable<{}>;
}
