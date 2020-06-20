import { Either, left, right, Right } from 'fp-ts/lib/Either';
import { Observable, from } from 'rxjs';
import { filter, map, materialize } from 'rxjs/operators';

type StreamValueFromPromise<V, R = unknown> = null | Either<V, R>;

/**
 * @param {PromiseLike<Value>} p
 * @returns {Observable<StreamValueFromPromise<Value, Rejection>>} a observable that emits a {@link Either} and complete
 */
export function toObservableEither<Value, Rejection = unknown>(
  p: PromiseLike<Value>,
): Observable<StreamValueFromPromise<Value, Rejection>> {
  return from(p).pipe(
    materialize(),
    map((notification) =>
      notification.do(
        (v) => right(v),
        (e) => left(e),
      ),
    ),
    filter((_) => _),
  );
}
