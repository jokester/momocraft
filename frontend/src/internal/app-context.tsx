import React, { createContext, createElement, MutableRefObject, useContext, useMemo } from 'react';
import { createLogger } from '../util/debug-logger';
import { buildEnv, inServer, isDevBuild } from '../config/build-env';
import { AuthServiceImpl } from './auth-service';
import { CollectionServiceImpl } from './collection-service';
import { Toaster } from '@blueprintjs/core';
import { FriendServiceImpl } from './friend-service';
import { bindApi } from '../api/bind-api';
import '../i18n/i18next-factory';
import { useLifeCycle } from '../components/generic-hooks/use-life-cycle';
import { createI18nInstance, LangCode } from '../i18n/i18next-factory';
import { I18NextReactProvider } from '../i18n/i18next-react';

type Singletons = ReturnType<typeof initSingletons>;

const AppContext = createContext<Singletons>(null!);

let singletonObjects: null | ReturnType<typeof createSingletons> = null;

const logger = createLogger(__filename);

function createSingletons() {
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

function initSingletons(props: { toasterRef: MutableRefObject<Toaster>; langCode: LangCode }) {
  if (!singletonObjects) {
    singletonObjects = createSingletons();
  }

  return {
    ...singletonObjects,
    toaster: props.toasterRef as { readonly current: Toaster },
  } as const;
}

export const AppContextHolder: React.FC<{ initialLang?: LangCode; toasterRef: MutableRefObject<Toaster> }> = ({
  toasterRef,
  initialLang,
  children,
}) => {
  const singletons = useMemo(() => initSingletons({ toasterRef, langCode: initialLang || LangCode.en }), []);

  const lifeCycle = useLifeCycle(
    () => logger('AppContext onMount'),
    () => logger('AppContext onUnmount'),
  );

  return (
    <AppContext.Provider value={singletons}>
      <I18NextReactProvider
        lang={initialLang}
        factory={(isServer, lang) => createI18nInstance(isServer, lang as LangCode)}
      >
        {children}
      </I18NextReactProvider>
    </AppContext.Provider>
  );
};

export const useSingletons = () => useContext(AppContext);
