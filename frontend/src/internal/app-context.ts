import React, { createContext, createElement, MutableRefObject, useContext, useEffect, useMemo } from 'react';
import { createLogger } from '../util/debug-logger';
import { buildEnv, inServer, isDevBuild } from '../config/build-env';
import { AuthServiceImpl } from './auth-service';
import { CollectionServiceImpl } from './collection-service';
import { Toaster } from '@blueprintjs/core';
import { FriendServiceImpl } from './friend-service';
import { bindApi } from '../api/bind-api';
import '../i18n/init-i18n';

type Singletons = ReturnType<typeof initSingletons>;

const AppContext = createContext<Singletons>(null!);

let singletonObjects: null | ReturnType<typeof createSingletons> = null;

function createSingletons() {
  const logger = createLogger(__filename);
  logger('build env', isDevBuild, buildEnv);

  const auth = new AuthServiceImpl(bindApi, !inServer);
  const collection = new CollectionServiceImpl(bindApi, auth);
  const friends = new FriendServiceImpl(bindApi, auth, collection);

  return {
    auth,
    collection,
    friends,
  } as const;
}

function initSingletons(props: { toasterRef: MutableRefObject<Toaster> }) {
  if (!singletonObjects) {
    singletonObjects = createSingletons();
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
