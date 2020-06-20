import { Observable, from, NEVER, concat } from 'rxjs';
import { concatAll, concatMapTo, dematerialize, materialize, switchMapTo, take } from 'rxjs/operators';

export function fromPromiseWithoutEnd<T>(p: PromiseLike<T>): Observable<T> {
  return concat(from(p).pipe(materialize(), take(1), dematerialize()), NEVER);
}
