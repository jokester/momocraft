import { Notification, Observable } from 'rxjs';
import { useEffect, useState } from 'react';
import { materialize } from 'rxjs/operators';

export function useLast<T>(observable: Observable<T>, initial: T | (() => T)): T {
  const [observed, setObserved] = useState(initial);

  useEffect(() => {
    const subscription = observable.subscribe({
      next: setObserved,
    });

    return () => subscription.unsubscribe();
  }, [observable]);
  return observed;
}

export function useObserved<T>(observable: Observable<T>, initial: T): Notification<T> {
  const [observed, setObserved] = useState(new Notification('N', initial));

  useEffect(() => {
    const subscription = observable.pipe(materialize()).subscribe({
      next: setObserved,
    });

    return () => subscription.unsubscribe();
  }, [observable]);

  return observed;
}
