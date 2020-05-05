import { ItemCollectionEntry } from '../model/collection';
import { ApiResponse } from './api-convention';

export interface CollectionService {
  saveCollections(changes: ItemCollectionEntry[]): ApiResponse<ItemCollectionEntry[]>;
  fetchOwnCollections(): ApiResponse<ItemCollectionEntry[]>;
  fetchCollections(userId: string): ApiResponse<ItemCollectionEntry[]>;
  // hard to get this performant?
  // observeCollections(itemName: string): Observable<{}>;
}
