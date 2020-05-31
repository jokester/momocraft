import React, { createContext, createElement, MutableRefObject, useContext, useMemo } from 'react';
import { createLogger } from '../util/debug-logger';
import { buildEnv, inServer, isDevBuild } from '../config/build-env';
import { AuthServiceImpl } from './auth-service';
import { CollectionServiceImpl } from './collection-service';
import { Toaster } from '@blueprintjs/core';
import { FriendServiceImpl } from './friend-service';
import { bindApi } from '../api/bind-api';
import '../i18n/init-i18n';
import { useLifeCycle } from '../components/generic-hooks/use-life-cycle';
import { initI18n, LangCode } from '../i18n/init-i18n';

type Singletons = ReturnType<typeof initSingletons>;

const AppContext = createContext<Singletons>(null!);

let singletonObjects: null | ReturnType<typeof createSingletons> = null;

const logger = createLogger(__filename);

function createSingletons(langCode: LangCode) {
  logger('build env', isDevBuild, buildEnv);

  initI18n(langCode);

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
    singletonObjects = createSingletons(props.langCode);
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

  return createElement(AppContext.Provider, {
    value: singletons,
    children,
  });
};

export const useSingletons = () => useContext(AppContext);
