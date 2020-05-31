import { useTranslation } from 'react-i18next';
import { LangMap } from '../../i18n/init-i18n';
import React from 'react';

export const LocalePicker: React.FC = () => {
  const [t, i18n] = useTranslation();

  return (
    <select
      value={i18n.language}
      onChange={(ev) => {
        i18n.changeLanguage(ev.target.value);
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
