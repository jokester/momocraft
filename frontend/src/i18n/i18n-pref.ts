import JsCookie from 'js-cookie';
import { CookieConsts } from '../ssr/middleware/cookie-consts';
import { LangCode } from './i18next-factory';

export function setLangCookie(code: LangCode) {
  JsCookie.set(CookieConsts.langPref, code, {
    expires: CookieConsts.endOfKnownWorld,
    sameSite: 'lax',
    secure: true,
  });
}
