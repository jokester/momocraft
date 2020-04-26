import React, { createContext, createElement, useContext, useMemo } from 'react';
import { createLogger } from '../util/debug-logger';
import { BuildEnv, isDevBuild } from '../config/build-env';

type Singletons = ReturnType<typeof initSingletons>;

const AppContext = createContext<Singletons>(null!);

function initSingletons() {
  if (1) {
    const logger = createLogger(__filename);
    logger('build env', isDevBuild, BuildEnv);
  }
  return {} as const;
}

export const AppContextHolder: React.FC = ({ children }) => {
  const singletons = useMemo(initSingletons, []);

  return createElement(AppContext.Provider, { value: singletons, children });
};

export const useSingletons = () => useContext(AppContext);
