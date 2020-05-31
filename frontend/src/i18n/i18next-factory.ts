import i18n, { InitOptions } from 'i18next';

import * as en from './json/en.json';
import * as ja from './json/ja.json';
import * as zhS from './json/zh-hans.json';
import * as zhT from './json/zh-hant.json';
import { isDevBuild } from '../config/build-env';
import { createLogger } from '../util/debug-logger';

const logger = createLogger(__filename);

export const enum LangCode {
  en = 'en',
  ja = 'ja',
  zhHanS = 'zh-hans',
  zhHanT = 'zh-hant',
}

export const LangMap = [
  /* [browser-language, our-language, label] */ [/^en/i, LangCode.en, 'English'],
  [/^zh-(cn|sg)/i, LangCode.zhHanS, '简体中文'],
  [/^zh/i, LangCode.zhHanT, '繁體中文'],
  [/^ja/i, LangCode.ja, '日本語'],
] as const;

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
    /* eslint-disable @typescript-eslint/ban-ts-ignore */
    // @ts-ignore
    [LangCode.en]: { all: en.default },
    // @ts-ignore
    [LangCode.zhHanT]: { all: zhT.default },
    // @ts-ignore
    [LangCode.zhHanS]: { all: zhS.default },
    // @ts-ignore
    [LangCode.ja]: { all: ja.default },
    /* eslint-enable @typescript-eslint/ban-ts-ignore */
  },
};

export function createI18nInstance(forSSR: boolean, lng: LangCode) {
  const fallbackLangs = pickFallbackLanguages(lng);

  const instance = i18n.createInstance({
    ...defaultI18nOptions,
    initImmediate: !forSSR,
    lng,
    fallbackLng: fallbackLangs,
  });

  instance.init();

  if (isDevBuild) {
    logger('inited i18n', instance);
  }
  return instance;
}
