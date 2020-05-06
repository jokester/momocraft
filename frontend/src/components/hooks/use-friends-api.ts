import { useSingletons } from '../../internal/app-context';
import { useAuthState } from './use-auth-state';
import { useMemo } from 'react';

export function useResolvedFriendCollections() {
  const singletons = useSingletons();
  const authed = useAuthState();

  return useMemo(() => singletons.friends.resolveFriendCollections(), [authed]);
}
