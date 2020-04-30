import { CollectionItem, CollectionState } from '../model/collection';
import { Observable } from 'rxjs';
import { ApiResponse } from './all';

interface CollectionUpdate {
  itemName: string;
  localState: CollectionState;
  serverState: CollectionState;
}

export interface CollectionService {
  saveCollections(changes: CollectionItem[]): ApiResponse<void>;
  fetchCollections(): ApiResponse<CollectionItem[]>;
  // hard to get this performant?
  // observeCollections(itemName: string): Observable<{}>;
}
