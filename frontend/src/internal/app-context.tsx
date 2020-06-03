import React, { createContext, MutableRefObject, useContext, useEffect, useMemo } from 'react';
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
import { I18NextReactProvider, useI18n } from 'i18next-react';
import Head from 'next/head';

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
        <LanguageChangeResponder />
        {children}
      </I18NextReactProvider>
    </AppContext.Provider>
  );
};

const LanguageChangeResponder: React.FC = () => {
  const i18n = useI18n();

  useEffect(() => {
    const setBodyLanguage = (lang: string) => (document.body.lang = lang);
    i18n.on('languageChanged', setBodyLanguage);
    return () => i18n.off('languageChanged', setBodyLanguage);
  }, [i18n]);

  return (
    /* default title */
    <Head>
      <title>{i18n.t('site.siteName')}</title>
    </Head>
  );
};

export const useSingletons = () => useContext(AppContext);
