import React, { createContext, createElement, useContext, useMemo } from 'react';
import { createLogger } from '../util/debug-logger';

type Singletons = ReturnType<typeof initSingletons>;

declare const process: {
  env: {
    MOMO_SERVER_HOST: string;
    NEXT_DEV: string;
    NEXT_SERVER: string;
  };
};

const AppContext = createContext<Singletons>(null!);

function initSingletons() {
  if (1) {
    const logger = createLogger(__filename);
    logger('server', process.env.MOMO_SERVER_HOST);
    logger('NEXT_DEV', process.env.NEXT_DEV);
    logger('NEXT_SERVER', process.env.NEXT_DEV);
  }
  return {} as const;
}

export const AppContextHolder: React.FC = ({ children }) => {
  const singletons = useMemo(initSingletons, []);

  return createElement(AppContext.Provider, { value: singletons, children });
};

export const useSingletons = () => useContext(AppContext);
