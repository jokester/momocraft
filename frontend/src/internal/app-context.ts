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
import { FriendServiceImpl } from './service-impl/friend-service';
import { FriendService } from '../service/friend-service';

type Singletons = ReturnType<typeof initSingletons>;

const AppContext = createContext<Singletons>(null!);

let singletonObjects: null | {
  auth: AuthService;
  collection: CollectionService;
  friends: FriendService;
} = null;

function initSingletons(props: { toasterRef: MutableRefObject<Toaster> }) {
  if (!singletonObjects) {
    const logger = createLogger(__filename);
    logger('build env', isDevBuild, buildEnv);

    const fetchImpl = inServer ? () => Never : fetch.bind(window);
    const apiClient = new ApiClient(fetchImpl, buildEnv.MOMO_SERVER_ORIGIN);

    const auth = new AuthServiceImpl(apiClient, !inServer);
    const collection = new CollectionServiceImpl(auth, apiClient);
    const friends = new FriendServiceImpl(auth, collection, apiClient);

    singletonObjects = {
      auth,
      collection,
      friends,
    };
  }

  return {
    ...singletonObjects,
    toaster: props.toasterRef as { readonly current: Toaster },
  } as const;
}

export const AppContextHolder: React.FC<{ toasterRef: MutableRefObject<Toaster> }> = ({ toasterRef, children }) => {
  const singletons = useMemo(() => initSingletons({ toasterRef }), []);

  return createElement(AppContext.Provider, {
    value: singletons,
    children,
  });
};

export const useSingletons = () => useContext(AppContext);
