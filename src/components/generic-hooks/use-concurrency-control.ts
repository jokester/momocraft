import { useMounted } from './use-mounted';
import { useCallback, useRef } from 'react';
import { ErrorCodeEnum } from '../../model/error-code';

export function useConcurrencyControl(maxConcurrency = 1) {
  const mounted = useMounted();
  const locked = useRef(maxConcurrency);

  const runWithLock = useCallback(
    <T>(foo: (m: typeof mounted) => Promise<T>): Promise<T> => {
      if (mounted.current && locked.current < maxConcurrency) {
        --locked.current;

        return foo(mounted).finally(() => mounted.current && ++locked.current);
      }
      return Promise.reject(ErrorCodeEnum.maxConcurrencyExceeded);
    },
    [maxConcurrency],
  );

  return [
    runWithLock,
    // FIXME: not sure we should expose this:
    locked.current,
  ] as const;
}
