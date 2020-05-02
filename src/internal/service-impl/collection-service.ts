import { CollectionService } from '../../service/collection-service';
import { CollectionItem } from '../../model/collection';
import { ApiResponse } from '../../service/api-convention';
import { Observable } from 'rxjs';

export class CollectionServiceImpl implements CollectionService {
  saveCollections(changes: CollectionItem[]): ApiResponse<void> {
    throw '';
  }
  fetchCollections(): ApiResponse<CollectionItem[]> {
    throw '';
  }
  observeCollections(itemName: string): Observable<{}> {
    throw 'todo';
  }
}
