import { GetServerSidePropsContext } from 'next';
import { LangCode, LangMap } from '../../i18n/init-i18n';
import * as cookie from 'cookie';
import { parse as parseHttpAcceptLang } from 'accept-language-parser';
import { CookieKeys } from './cookie-keys';

export function handleLangCookieAndReturnLanguage(ctx: GetServerSidePropsContext) {
  let langCode: LangCode;
  {
    const cookieInReq = cookie.parse(ctx.req.headers.cookie ?? '');

    {
      const langInCookie = cookieInReq[CookieKeys.langPref];
      langCode = pickLanguage(langInCookie, ctx.req.headers['accept-language']);
      if (langCode !== langInCookie) {
        ctx.res.setHeader(
          'set-cookie',
          cookie.serialize(CookieKeys.langPref, langCode, {
            expires: /* it's safe to expire when the world gets doomed */ new Date(-(1 << 31) * 1e3),
            sameSite: 'strict',
          }),
        );
      }
    }
  }

  return { langCode } as const;
}

function pickLanguage(langPrefInCookie: string, httpAcceptHeader?: string): LangCode {
  if ([LangCode.ja, LangCode.en, LangCode.zhHanS, LangCode.zhHanT].includes(langPrefInCookie as LangCode)) {
    return langPrefInCookie as LangCode;
  }

  for (const specified of parseHttpAcceptLang(httpAcceptHeader || ''))
    for (const [re, lang] of LangMap) {
      if (re.exec(`${specified.code}-${specified.region}`)) {
        return lang;
      }
    }

  return LangCode.en;
}
