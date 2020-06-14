import { PromiseContainer, PromiseState } from './promise-container';

describe('promise-container', () => {
  it('keeps promised value', async () => {
    const x = new PromiseContainer<number>(1);

    expect(x.state).toEqual(PromiseState.pending);
    if (x.isFulfilled()) {
      const shouldBeNum = x.value;
    }

    if (x.isPending()) {
      const y = x.reason;

      if (x.isRejected()) {
        const z = x.reason;
      }
    }
  });
});
