import { left, right } from 'fp-ts/lib/Either';
import { toObservableEither } from './to-observable-either';
import { of } from 'rxjs';
import { mergeMap, switchMap, take, toArray, startWith } from 'rxjs/operators';

describe('toObservableEither', () => {
  it('converts promise to observable', async () => {
    const o = toObservableEither(Promise.resolve(1));
    expect(await o.toPromise()).toEqual(right(1));
  });

  it('transforms (stream of promise) to (stream of promise result)', async () => {
    const o = of(1, 2, 3, 4, 5).pipe(
      mergeMap((v) => toObservableEither(v % 2 ? Promise.resolve(v) : Promise.reject(v))),
      take(20),
      toArray(),
    );

    expect(await o.toPromise()).toMatchSnapshot();
  });
});
