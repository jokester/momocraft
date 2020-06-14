export const enum PromiseState {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}

interface ReplaceOptions {
  onPending?: boolean;
  onFulfilled?: boolean;
  onRejected?: boolean;
}

type DiscriminatedType<T> =
  | {
      state: PromiseState.pending;
    }
  | {
      state: PromiseState.fulfilled;
      value: T;
    }
  | {
      state: PromiseState.rejected;
      reason: unknown;
    };

export class PromiseContainer<T> implements PromiseLike<T> {
  private innerPromise: Promise<T>;
  private _value: null | T = null;
  private _reason: unknown = null;

  private _state!: PromiseState;

  constructor(initial?: T | PromiseLike<T>) {
    if (initial) {
      const p = (this.innerPromise = Promise.resolve(initial));
      this.replaceInnerPromise(p);
    } else {
      this.innerPromise = Promise.reject('empty');
      this._state = PromiseState.rejected;
    }
  }

  get state(): PromiseState {
    return this._state;
  }

  isFulfilled(): this is never | { readonly value: T } {
    return this._state === PromiseState.fulfilled;
  }

  isRejected(): this is never | { readonly reason: unknown } {
    return this._state === PromiseState.rejected;
  }

  isPending(): boolean {
    return this._state === PromiseState.pending;
  }

  get value(): never {
    return this._value as never;
  }

  get reason(): never {
    return this._reason as never;
  }

  replace(generator: (previous: Promise<T>) => PromiseLike<T>, options: ReplaceOptions = {}): Promise<T> {
    const { onPending = false, onFulfilled = false, onRejected = true } = options;

    if (
      (onPending && this._state === PromiseState.pending) ||
      (onFulfilled && this._state === PromiseState.fulfilled) ||
      (onRejected && this._state === PromiseState.rejected)
    ) {
      const newPromise = Promise.resolve(generator(this.innerPromise));
      this.replaceInnerPromise(newPromise);
      return newPromise;
    }
    return this.innerPromise;
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => PromiseLike<TResult1> | TResult1) | undefined | null,
    onrejected?: ((reason: any) => PromiseLike<TResult2> | TResult2) | undefined | null,
  ): Promise<TResult1 | TResult2> {
    return this.innerPromise.then(onfulfilled, onrejected);
  }

  private replaceInnerPromise(p: Promise<T>) {
    this._state = PromiseState.pending;
    this.innerPromise = p;
    p.then(
      (v) => this.setStateForPromise(p, PromiseState.fulfilled, v),
      (e) => this.setStateForPromise(p, PromiseState.rejected, e),
    );
  }

  private setStateForPromise(p: PromiseLike<T>, newState: PromiseState, fulfillOrReject: any) {
    if (this.innerPromise === p) {
      if (newState === PromiseState.fulfilled) {
        this._value = fulfillOrReject;
        this._reason = null;
      } else if (newState === PromiseState.rejected) {
        this._value = null;
        this._reason = fulfillOrReject;
      } else {
        // pending
        this._value = this._reason = null;
      }
    }
  }
}
