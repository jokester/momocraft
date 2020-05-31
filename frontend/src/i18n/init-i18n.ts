import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as en from './json/en.json';
import * as ja from './json/ja.json';
import * as zhS from './json/zh-hans.json';
import * as zhT from './json/zh-hant.json';

const enum SupportedLangs {
  en = 'en',
  ja = 'ja',
  zhHanS = 'zh-hans',
  zhHanT = 'zh-hant',
}

const fallbackLocale = SupportedLangs.en;

const langMap = [
  /* [browser-language, our-language] */
  [/^en/i, SupportedLangs.en],
  [/^zh-(cn|sg)/i, SupportedLangs.zhHanS],
  [/^zh/i, SupportedLangs.zhHanT],
  [/^ja/i, SupportedLangs.ja],
] as const;

export function detectClientLang(): SupportedLangs {
  if (typeof navigator === 'undefined') return fallbackLocale;

  for (const possibleLang of [navigator.language, ...(navigator.languages ?? [])]) {
    for (const [pattern, lang] of langMap) {
      if (pattern.test(possibleLang)) return lang;
    }
  }

  return fallbackLocale;
}

export function pickLocale(routeLocale: string, clientLocale: null | string) {}

export function initI18n(lang: SupportedLangs) {
  i18n.use(initReactI18next).init({
    lng: lang,
    resources: {
      // @ts-ignore
      [SupportedLangs.en]: en.default,
      // @ts-ignore
      [SupportedLangs.zhHanT]: zhT.default,
      // @ts-ignore
      [SupportedLangs.zhHanS]: zhS.default,
      // @ts-ignore
      [SupportedLangs.ja]: ja.default,
    },
  });

  return i18n;
}
