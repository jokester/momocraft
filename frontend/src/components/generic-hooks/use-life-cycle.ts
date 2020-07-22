import { useEffect, useMemo } from 'react';
import { useMounted } from '@jokester/ts-commonutil/lib/react/hook/use-mounted';

export function useLifeCycle(onMount: () => void, onUnmount: () => void, displayName?: string) {
  const mounted = useMounted();
  const callbacks = useMemo(() => ({ onMount, onUnmount } as const), []);

  useEffect(() => {
    callbacks.onMount();
    return () => {
      callbacks.onUnmount();
    };
  }, []);

  return mounted;
}
