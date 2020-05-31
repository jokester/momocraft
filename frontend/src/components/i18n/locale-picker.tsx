import { useTranslation } from 'react-i18next';
import { LangMap } from '../../i18n/init-i18n';
import React from 'react';
import JsCookie from 'js-cookie';
import { CookieKeys } from '../../ssr/middleware/cookie-keys';

export const LocalePicker: React.FC = () => {
  const [t, i18n] = useTranslation();

  return (
    <select
      value={i18n.language}
      onChange={(ev) => {
        i18n.changeLanguage(ev.target.value);
        JsCookie.set(CookieKeys.langPref, ev.target.value, {
          sameSite: 'strict',
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
