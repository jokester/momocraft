import { GetServerSidePropsContext } from 'next';
import { LangCode, LangMap } from '../../i18n/i18next-factory';
import * as cookie from 'cookie';
import { parse as parseHttpAcceptLang } from 'accept-language-parser';
import { CookieConsts } from './cookie-consts';

export function inferLangForCookie(ctx: GetServerSidePropsContext) {
  const cookieInReq = cookie.parse(ctx.req.headers.cookie ?? '');

  const langInCookie = cookieInReq[CookieConsts.langPref];
  const langCode = pickLanguage(LangCode.en, langInCookie, ctx.req.headers['accept-language']);

  if (langCode !== langInCookie) {
    /**
     * set-cookie so that client can use it
     */
    ctx.res.setHeader(
      'set-cookie',
      cookie.serialize(CookieConsts.langPref, langCode, {
        expires: CookieConsts.endOfKnownWorld,
        sameSite: 'lax',
        secure: true,
      }),
    );
  }

  return { langCode } as const;
}

function pickLanguage(fallback: LangCode, existedPref?: string, httpAcceptHeader?: string): LangCode {
  if ([LangCode.ja, LangCode.en, LangCode.zhHanS, LangCode.zhHanT].includes(existedPref as LangCode)) {
    return existedPref as LangCode;
  }

  for (const specified of parseHttpAcceptLang(httpAcceptHeader || ''))
    for (const [re, lang] of LangMap) {
      if (re.exec(`${specified.code}-${specified.region}`)) {
        return lang;
      }
    }

  return LangCode.en;
}
