import { Notification, Observable } from 'rxjs';
import { useEffect, useState, useRef, RefObject } from 'react';
import { materialize } from 'rxjs/operators';
import { createLogger } from '../../util/debug-logger';

const logger = createLogger(__filename);

export function useFirstRender(): RefObject<boolean> {
  const firstRender = useRef(true);
  useEffect(() => {
    firstRender.current = false;
  }, []);
  return firstRender;
}

export function useObserved<T>(observable: Observable<T>, initial: T | (() => T)): T {
  const [observed, setObserved] = useState<T>(initial);
  const firstRender = useFirstRender();

  useEffect(() => {
    if (!firstRender.current) setObserved(initial);

    const subscription = observable.subscribe({
      next: (v) => {
        logger('userObserved:next', v);
        setObserved(v);
      },
    });

    return () => subscription.unsubscribe();
  }, [observable]);

  return observed;
}

export function useMaterializedObserved<T>(observable: Observable<T>, initial: T): Notification<T> {
  const [observed, setObserved] = useState(new Notification('N', initial));

  useEffect(() => {
    const subscription = observable.pipe(materialize()).subscribe({
      next: setObserved,
    });

    return () => subscription.unsubscribe();
  }, [observable]);

  return observed;
}
