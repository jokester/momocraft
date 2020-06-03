import React from 'react';
import { useI18n } from 'i18next-react';

export const FrontpageIntro: React.FC = () => {
  const i18n = useI18n();
  return (
    <div className="mt-20 px-4 md:px-8 lg:px-16 leading-tight">
      <h2 className="text-2xl mb-2 font-semibold">{i18n.t('site.siteName')}</h2>
      <h3 className="text-xl">{i18n.t('site.siteDesc')}</h3>
    </div>
  );
};
