import { Button, MenuItem, Alignment } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import React from 'react';
import { createLogger } from '../../util/debug-logger';
import { useI18n } from 'i18next-react';
import { pickLanguageLabel } from '../../i18n/i18next-factory';
import { LangCode, LangMap } from '../../const/languages';

const logger = createLogger(__filename);

const LangSelect = Select.ofType<LangCode>();

export const LanguagePicker: React.FC = () => {
  const i18n = useI18n();

  return (
    <LangSelect
      items={[...LangMap.keys()]}
      itemRenderer={(code, modifier) => (
        <Button
          key={code}
          className={`mx-1`}
          lang={code}
          onClick={modifier.handleClick}
          large={code === i18n.language}
          small={code !== i18n.language}
        >
          {pickLanguageLabel(code)}
        </Button>
      )}
      filterable={false}
      onItemSelect={(selected) => {
        i18n.changeLanguage(selected);
      }}
    >
      <Button alignText={Alignment.CENTER} icon="translate" />
    </LangSelect>
  );
};
