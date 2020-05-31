import { GetServerSidePropsContext } from 'next';
import { LangCode, LangMap } from '../../i18n/init-i18n';
import * as cookie from 'cookie';
import { parse as parseHttpAcceptLang } from 'accept-language-parser';
import { CookieConsts } from './cookie-consts';

export function handleLangCookieAndReturnLanguage(ctx: GetServerSidePropsContext) {
  let langCode: LangCode;
  {
    const cookieInReq = cookie.parse(ctx.req.headers.cookie ?? '');

    {
      const langInCookie = cookieInReq[CookieConsts.langPref];
      langCode = pickLanguage(langInCookie, ctx.req.headers['accept-language']);
      if (langCode !== langInCookie) {
        ctx.res.setHeader(
          'set-cookie',
          cookie.serialize(CookieConsts.langPref, langCode, {
            expires: CookieConsts.endOfKnownWorld,
            sameSite: 'strict',
            secure: true,
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
