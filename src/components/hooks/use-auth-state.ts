import { useSingletons } from '../../internal/app-context';
import { useMemo } from 'react';
import { useObserved } from './use-observed';
import { dummyAuthState } from '../../service/all';
import { ExposedAuthState } from '../../service/user-auth';

export function useAuthState(): ExposedAuthState {
  const { auth } = useSingletons();
  const authState = useMemo(() => auth.authed, [auth]);

  return useObserved(authState, dummyAuthState);
}
