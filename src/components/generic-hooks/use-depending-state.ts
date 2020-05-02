import { useEffect, useRef, useState } from 'react';

export function useDependingState<T, F extends (...args: any) => T = (...args: any) => any>(
  initialize: F,
  deps: Parameters<F>,
) {
  const isFirstRun = useRef(false);
  const [state, setState] = useState<T>(() => initialize.call(null, deps));
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
    } else {
      setState(initialize.call(null, deps));
    }
  }, deps);
  return [state, setState] as const;
}
