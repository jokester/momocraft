import { from, NEVER, of, concat } from 'rxjs';
import { flatMap, materialize, switchMap, take, toArray } from 'rxjs/operators';
import { fromPromiseWithoutEnd } from './from-promise';

describe('from-promise', () => {
  it('rxjs', async () => {
    const fromRxjs1 = from(Promise.resolve(1)).pipe(materialize(), take(1), toArray());

    expect(await fromRxjs1.toPromise()).toMatchSnapshot('fromRxJs1');
  });

  it /* always timeout */.skip('transforms Promise to a 0|1', async () => {
    const p1 = fromPromiseWithoutEnd(Promise.resolve(1)).pipe(toArray());
    expect(await p1.toPromise()).toEqual([1, 2, 3]);
  });

  it('wtf1', async () => {
    expect(await from(Promise.resolve(1)).pipe(toArray()).toPromise()).toEqual([1]);
  });
});
