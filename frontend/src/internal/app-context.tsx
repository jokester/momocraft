import React, { createContext, MutableRefObject, useContext, useMemo } from 'react';
import { createLogger } from '../util/debug-logger';
import { buildEnv, inServer, isDevBuild } from '../const/build-env';
import { AuthServiceImpl } from './auth-service';
import { CollectionServiceImpl } from './collection-service';
import { Toaster } from '@blueprintjs/core';
import { FriendServiceImpl } from './friend-service';
import { bindApi } from '../api/bind-api';
import { createI18nInstance } from '../i18n/i18next-factory';
import { useLifeCycle } from '../components/generic-hooks/use-life-cycle';

import { I18NextReactProvider } from 'i18next-react';
import { LanguageSelectionResponder } from '../components/i18n/language-selection-responder';
import { LangCode } from '../const/languages';

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

function initSingletons(props: { toasterRef: MutableRefObject<Toaster> }) {
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
  const lang = initialLang || (typeof document !== null && (document.documentElement.lang as LangCode)) || LangCode.en;

  const singletons = useMemo(() => initSingletons({ toasterRef }), []);

  const lifeCycle = useLifeCycle(
    () => logger('AppContext onMount'),
    () => logger('AppContext onUnmount'),
  );

  return (
    <AppContext.Provider value={singletons}>
      <I18NextReactProvider lang={lang} factory={(isServer, lang) => createI18nInstance(isServer, lang as LangCode)}>
        <LanguageSelectionResponder />
        {children}
      </I18NextReactProvider>
    </AppContext.Provider>
  );
};

export const useSingletons = () => useContext(AppContext);
