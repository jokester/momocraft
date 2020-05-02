import React, { createContext, createElement, useContext, useEffect, useMemo } from 'react';
import { createLogger } from '../util/debug-logger';
import { buildEnv, inServer, isDevBuild } from '../config/build-env';
import { Never } from '@jokester/ts-commonutil/concurrency/timing';
import { ApiClient } from './service-impl/client';
import { AuthServiceImpl } from './service-impl/auth-service';
import { AuthService } from '../service/auth-service';
import { CollectionServiceImpl } from './service-impl/collection-service';
import { CollectionService } from '../service/collection-service';

type Singletons = ReturnType<typeof initSingletons>;

const AppContext = createContext<Singletons>(null!);

function initSingletons() {
  if (1) {
    const logger = createLogger(__filename);
    logger('build env', isDevBuild, buildEnv);
  }

  // FIXME: Never may cause memory leak in server (if any)
  const fetchImpl = inServer ? () => Never : fetch.bind(window);
  const apiClient = new ApiClient(fetchImpl, buildEnv.MOMO_SERVER_ORIGIN);

  const auth = new AuthServiceImpl(apiClient);
  const collection = new CollectionServiceImpl(auth, apiClient);

  return {
    auth: auth as AuthService,
    collection: collection as CollectionService,
  } as const;
}

export const AppContextHolder: React.FC = ({ children }) => {
  const singletons = useMemo(initSingletons, []);

  useEffect(() => () => console.error('unexpected: AppContextHolder unmounted'), []);

  return createElement(AppContext.Provider, { value: singletons, children });
};

export const useSingletons = () => useContext(AppContext);
