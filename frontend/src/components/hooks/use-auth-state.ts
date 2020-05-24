import { useSingletons } from '../../internal/app-context';
import { useMemo } from 'react';
import { useObserved } from '../generic-hooks/use-observed';
import { dummyAuthState } from '../../api/api-convention';
import { ExposedAuthState } from '../../internal/auth-service';

export function useAuthState(): ExposedAuthState {
  const { auth } = useSingletons();
  const authState = useMemo(() => auth.authed, [auth]);

  return useObserved(authState, dummyAuthState);
}
