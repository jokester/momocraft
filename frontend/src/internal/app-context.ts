import React, { createContext, createElement, MutableRefObject, useContext, useEffect, useMemo } from 'react';
import { createLogger } from '../util/debug-logger';
import { buildEnv, inServer, isDevBuild } from '../config/build-env';
import { Never } from '@jokester/ts-commonutil/concurrency/timing';
import { ApiClient } from './service-impl/client';
import { AuthServiceImpl } from './service-impl/auth-service';
import { AuthService } from '../service/auth-service';
import { CollectionServiceImpl } from './service-impl/collection-service';
import { CollectionService } from '../service/collection-service';
import { Toaster } from '@blueprintjs/core';
import { ObserverInstanceProvider } from '../components/generic-hooks/use-visible';
import { FriendServiceImpl } from './service-impl/friend-service';
import { FriendService } from '../service/friend-service';

type Singletons = ReturnType<typeof initSingletons>;

const AppContext = createContext<Singletons>(null!);

function initSingletons(props: { toasterRef: MutableRefObject<Toaster> }) {
  if (1) {
    const logger = createLogger(__filename);
    logger('build env', isDevBuild, buildEnv);
  }

  // FIXME: Never may cause memory leak in server (if any)
  const fetchImpl = inServer ? () => Never : fetch.bind(window);
  const apiClient = new ApiClient(fetchImpl, buildEnv.MOMO_SERVER_ORIGIN);

  const auth = new AuthServiceImpl(apiClient, !inServer);
  const collection = new CollectionServiceImpl(auth, apiClient);
  const friends = new FriendServiceImpl(auth, collection, apiClient);

  return {
    auth: auth as AuthService,
    collection: collection as CollectionService,
    friends: friends as FriendService,
    toaster: props.toasterRef as { readonly current: Toaster },
  } as const;
}

export const AppContextHolder: React.FC<{ toasterRef: MutableRefObject<Toaster> }> = ({ toasterRef, children }) => {
  const singletons = useMemo(() => initSingletons({ toasterRef }), []);

  useEffect(() => () => console.error('unexpected: AppContextHolder unmounted'), []);

  return createElement(
    AppContext.Provider,
    {
      value: singletons,
    },
    createElement(ObserverInstanceProvider, { children } as any),
  );
};

export const useSingletons = () => useContext(AppContext);
