import i18n, { InitOptions } from 'i18next';

import * as en from './json/en.json';
import * as ja from './json/ja.json';
import * as zhS from './json/zh-hans.json';
import * as zhT from './json/zh-hant.json';
import { inBrowser, isDevBuild } from '../config/build-env';
import { createLogger } from '../util/debug-logger';
import { initReactI18next, setDefaults } from 'react-i18next';

const logger = createLogger(__filename);

export const enum LangCode {
  en = 'en',
  ja = 'ja',
  zhHanS = 'zh-hans',
  zhHanT = 'zh-hant',
}

export const LangMap = [
  /* [browser-language, our-language, label] */
  [/^en/i, LangCode.en, 'English'],
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

/**
 * no need to useSuspense: nextjs dont support it && we dont have async resource
 */
setDefaults({ useSuspense: false });

const defaultI18nOptions: InitOptions = {
  debug: true,
  defaultNS: 'all',
  ns: ['all'],
  initImmediate: false,
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

export function initI18n(lng: LangCode) {
  const boundInstance = i18n
    .createInstance({ ...defaultI18nOptions, lng, fallbackLng: pickFallbackLanguages(lng) })
    .use(initReactI18next);

  logger('inited', lng, boundInstance);

  if (inBrowser && isDevBuild) {
    for (const event of ['initialized', 'loaded', 'failedLoading', 'missingKey', 'languageChanged'] as const) {
      i18n.on(event, (ev: unknown) => {
        logger('i18n', event, ev);
      });
    }
  }

  boundInstance.init();
}
