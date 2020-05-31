/**
 * yet another binding for i18next
 * it's so damn hard to get react-18next work in next
 *
 * - required
 */
import { createContext, useContext, useEffect, useState } from 'react';
import { i18n } from 'i18next';
import { createI18nInstance, LangCode } from './init-i18n';
import { inServer } from '../config/build-env';

export const I18NextReactContext = createContext<InternalI18nState>(null!);

interface InternalI18nState {
  // a phantom field to propagate changes
  readonly lng: string;
  readonly instance: i18n;
}

export function useI18nProvider(propsLang: LangCode) {
  const [internal, setInternal] = useState<InternalI18nState>(() => {
    const instance = createI18nInstance(propsLang, inServer);
    instance.on('languageChanged', (lang) => {
      setInternal((prevInstance: InternalI18nState) => ({ ...prevInstance, lang }));
    });

    return {
      instance,
      lng: propsLang,
    };
  });

  useEffect(() => {
    if (internal.instance.language !== propsLang) {
      internal.instance.changeLanguage(propsLang);
    }
  }, [propsLang]);

  return internal;
}

export function useI18n() {
  return useContext(I18NextReactContext).instance;
}
