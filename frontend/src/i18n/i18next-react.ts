/**
 * yet another binding for i18next
 * it's so damn hard to get react-18next work in next
 *
 * - required
 */
import { createContext, useContext, useEffect, useState, FunctionComponent, createElement, useRef } from 'react';
import { i18n } from 'i18next';

const I18NextReactContext = createContext<InternalI18nState>(null!);

interface InternalI18nState {
  /**
   * a phantom field invisible
   */
  lng: string;
  /**
   *
   */
  instance: i18n;
}

interface I18NFactory {
  /**
   * @param {boolean} inServer
   * @param {string} lang
   * @returns {i18n} configured (and possibly loaded) i18n instance
   */
  (inServer: boolean, lang?: string): i18n;
}

const inServer = typeof window === 'undefined';

export const I18NextReactProvider: FunctionComponent<{ lang?: string; factory: I18NFactory }> = (props) => {
  const mounted = useRef(false);

  const [internal, setInternal] = useState<InternalI18nState>(() => {
    const instance = props.factory(inServer, props.lang);

    const ret = {
      instance,
      lng: instance.language,
    };

    if (!inServer) {
      instance.on('languageChanged', (lang) => {
        mounted.current && setInternal((prevInstance: InternalI18nState) => ({ ...prevInstance, lang }));
      });
    }

    return ret;
  });

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (props.lang && props.lang !== internal.instance.language) {
      internal.instance.changeLanguage(props.lang); // and continue in languageChanged event handler
    }
  }, [props.lang]);

  return createElement(I18NextReactContext.Provider, { value: internal }, props.children);
};

export function useI18n() {
  return useContext(I18NextReactContext).instance;
}
