import React, { createContext, MutableRefObject, useContext, useMemo } from 'react';
import { createLogger } from '../util/debug-logger';
import { buildEnv, inServer, isDevBuild } from '../const/build-env';
import { AuthServiceImpl } from './auth-service';
import { CollectionServiceImpl } from './collection-service';
import { FriendServiceImpl } from './friend-service';
import { bindApi } from '../services/api/bind-api';
import { createI18nInstance } from '../i18n/i18next-factory';
import { useLifeCycle } from '../components/generic-hooks/use-life-cycle';

import { I18NextReactProvider } from 'i18next-react';
import { LanguageSelectionResponder } from '../components/i18n/language-selection-responder';
import { LangCode } from '../const/languages';
import { useToast } from '@chakra-ui/core';
import useConstant from 'use-constant';
import { ApiError } from '../services/api/api-convention';
import { deriveErrorMessage } from '../i18n/error-message';
import { isSome } from 'fp-ts/lib/Option';

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

function initSingletons(props: { toast: ReturnType<typeof useToast> }) {
  if (!singletonObjects) {
    singletonObjects = createSingletons();
  }

  const toastHelper = {
    handleApiError: (apiError: ApiError) => {
      const msg = deriveErrorMessage(apiError);
      if (isSome(msg)) {
        props.toast({
          title: msg.value,
        });
      }
    },
  } as const;

  return {
    ...singletonObjects,
    ...props,
    toastHelper,
  } as const;
}

export const AppContextHolder: React.FC<{ initialLang?: LangCode }> = ({ initialLang, children }) => {
  const lang = initialLang || (typeof document !== null && (document.documentElement.lang as LangCode)) || LangCode.en;
  const toast = useToast();

  const singletons = useConstant(() => initSingletons({ toast }));

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
