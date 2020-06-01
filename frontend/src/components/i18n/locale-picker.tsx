import { Button, MenuItem, Alignment } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { LangCode, LangMap, pickLanguageLabel } from '../../i18n/i18next-factory';
import React from 'react';
import { createLogger } from '../../util/debug-logger';
import { useI18n } from 'i18next-react';
import { setLangCookie } from '../../i18n/i18n-pref';

const logger = createLogger(__filename);

const LangSelect = Select.ofType<LangCode>();

export const LocalePicker: React.FC = () => {
  const i18n = useI18n();

  return (
    <LangSelect
      items={[...LangMap.keys()]}
      itemRenderer={(code, modifier) => (
        <Button
          key={code}
          className="mx-1"
          onClick={modifier.handleClick}
          large={code === i18n.language}
          small={code !== i18n.language}
        >
          {pickLanguageLabel(code)}
        </Button>
      )}
      filterable={false}
      onItemSelect={(selected) => {
        setLangCookie(selected as LangCode);
        i18n.changeLanguage(selected);
      }}
    >
      <Button alignText={Alignment.CENTER} icon="translate" />
    </LangSelect>
  );
};
