import i18n, { InitOptions } from 'i18next';

import en from './json/en.json';
import ja from './json/ja.json';
import zhS from './json/zh-hans.json';
import zhT from './json/zh-hant.json';
import { isDevBuild } from '../config/build-env';
import { createLogger } from '../util/debug-logger';
import { I18NFactory } from 'i18next-react';

const logger = createLogger(__filename);

export const enum LangCode {
  en = 'en',
  ja = 'ja',
  zhHanS = 'zh-hans',
  zhHanT = 'zh-hant',
}

export const LangMap = new Map([
  [LangCode.zhHanS, { pattern: /^zh-(cn|sg)/i, label: '简体中文' }],
  [LangCode.zhHanT, { pattern: /^zh/i, label: '繁體中文' }],
  [LangCode.en, { pattern: /^en/i, label: 'English' }],
  [LangCode.ja, { pattern: /^ja/i, label: '日本語' }],
] as const);
/* [browser-language, our-language, label] */

export const pickLanguageLabel = (code: string) => LangMap.get(code as LangCode)?.label || '';

function pickFallbackLanguages(wanted: LangCode) {
  switch (wanted) {
    case LangCode.ja:
      return [LangCode.zhHanT, LangCode.zhHanS, LangCode.en];
    case LangCode.zhHanT:
      return [LangCode.zhHanS, LangCode.ja, LangCode.en];
    case LangCode.zhHanS:
      return [LangCode.zhHanT, LangCode.ja, LangCode.en];
    case LangCode.en:
    default:
      return [LangCode.ja, LangCode.zhHanS, LangCode.zhHanT];
  }
}

const defaultI18nOptions: InitOptions = {
  defaultNS: 'all',
  ns: ['all'],
  resources: {
    [LangCode.en]: { all: en },
    [LangCode.zhHanT]: { all: zhT },
    [LangCode.zhHanS]: { all: zhS },
    [LangCode.ja]: { all: ja },
  },
};

export const createI18nInstance: I18NFactory = (forSSR: boolean, lng?: string) => {
  const fallbackLangs = pickFallbackLanguages(lng as LangCode);

  const instance = i18n.createInstance({
    ...defaultI18nOptions,
    initImmediate: !forSSR,
    lng,
    fallbackLng: fallbackLangs,
  });

  instance.init();

  if (isDevBuild) {
    // logger('inited i18n', instance);
  }
  return instance;
};
