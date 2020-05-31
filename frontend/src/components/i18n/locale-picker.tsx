import { LangMap } from '../../i18n/init-i18n';
import React from 'react';
import JsCookie from 'js-cookie';
import { CookieConsts } from '../../ssr/middleware/cookie-consts';
import { createLogger } from '../../util/debug-logger';
import { useI18n } from '../../i18n/i18next-react';

const logger = createLogger(__filename);

export const LocalePicker: React.FC = () => {
  const i18n = useI18n();

  logger('first render', i18n.language);

  return (
    <select
      value={i18n.language}
      onChange={(ev) => {
        i18n.changeLanguage(ev.target.value);
        JsCookie.set(CookieConsts.langPref, ev.target.value, {
          expires: CookieConsts.endOfKnownWorld,
          sameSite: 'lax',
          secure: true,
        });
      }}
    >
      {LangMap.map(([_, langCode, langName]) => (
        <option key={langCode} value={langCode}>
          {langName}
        </option>
      ))}
    </select>
  );
};
