import i18n, { InitOptions } from 'i18next';

import * as en from './json/en.json';
import * as ja from './json/ja.json';
import * as zhS from './json/zh-hans.json';
import * as zhT from './json/zh-hant.json';
import { inBrowser, inServer } from '../config/build-env';
import { createLogger } from '../util/debug-logger';
import { initReactI18next } from 'react-i18next';

const logger = createLogger(__filename);

export const enum LangCode {
  en = 'en',
  ja = 'ja',
  zhHanS = 'zh-hans',
  zhHanT = 'zh-hant',
}

const defaultLang = LangCode.en;

export const LangMap = [
  /* [browser-language, our-language] */
  [/^en/i, LangCode.en, 'English'],
  [/^zh-(cn|sg)/i, LangCode.zhHanS, '简体中文'],
  [/^zh/i, LangCode.zhHanT, '繁體中文'],
  [/^ja/i, LangCode.ja, '日本語'],
] as const;

export function detectClientLang(): LangCode {
  if (typeof navigator === 'undefined') return defaultLang;

  for (const possibleLang of [navigator.language, ...(navigator.languages ?? [])]) {
    for (const [pattern, lang] of LangMap) {
      if (pattern.test(possibleLang)) return lang;
    }
  }

  return defaultLang;
}

export function pickLocale(routeLocale: string, clientLocale: null | string) {}

async function initI18n(lang: LangCode) {
  const initOptions: InitOptions = {
    lng: lang,
    debug: true,
    fallbackLng: LangCode.en,
    resources: {
      // @ts-ignore
      [LangCode.en]: { all: en.default },
      // @ts-ignore
      [LangCode.zhHanT]: { all: zhT.default },
      // @ts-ignore
      [LangCode.zhHanS]: { all: zhS.default },
      // @ts-ignore
      [LangCode.ja]: { all: ja.default },
    },
    defaultNS: 'all',
    ns: ['all'],
  };

  logger('initOptions', initOptions);
  const inited = await i18n.cloneInstance().use(initReactI18next).init(initOptions);

  logger('inited', inited);
  logger('inited', inited('siteName'));
  logger('inited', inited('site.siteName'));

  if (inBrowser) {
    for (const event of ['initialized', 'loaded', 'failedLoading', 'missingKey', 'languageChanged'] as const) {
      i18n.on(event, (ev: unknown) => {
        logger('i18n', event, ev);
      });
    }
  }

  return inited;
}

// initI18n(LangCode.en);
