import { ReactElement, useMemo, useState } from 'react';
import { useLifeCycle } from '../hooks/use-life-cycle';

interface PromiseLikeCallback<T, E = unknown> {
  (fulfill: (value: T) => void, reject: (reason: E) => void): ReactElement;
}

export function useModalApi() {
  const lifecycle = useLifeCycle('modalRoot');
  const [modalElem, setModelElem] = useState<null | ReactElement>(null);

  const modalApi = useMemo(
    () =>
      ({
        showModal<T>(creator: PromiseLikeCallback<T>) {
          return new Promise<T>((fulfill, reject) => {
            if (!lifecycle.mounted) {
              reject('useModalApi(): invariant violation, caller component is not mounted');
            } else {
              lifecycle.onUnmount(() => reject('unmounted')); // a final guard
              setModelElem(creator(fulfill, reject) || null);
            }
          }).finally(() => lifecycle.mounted && setModelElem(null));
        },
        clearModal() {
          lifecycle.mounted && setModelElem(null);
        },
      } as const),
    [],
  );

  return [modalElem, modalApi] as const;
}
