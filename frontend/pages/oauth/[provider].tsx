import { PreJson } from '../../src/dummy/pre-json';
import { PageType } from '../../src/next-types';
import { CenterH, Layout } from '../../src/components/layout/layout';
import { defaultGetServerSideProps } from '../../src/ssr/default-get-server-side-props';
import { useRouter } from 'next/router';
import React from 'react';
import { OAuthProvider } from '../../src/const-shared/oauth-conf';
import { useOAuthCodeCallback } from '../../src/components/auth/oauth-code-responder';
import { useI18n } from 'i18next-react';

interface UrlParam {
  provider: OAuthProvider;
  code?: string;
}

const OAuthCallbackPage: PageType<UrlParam> = (props) => {
  const {
    query: { provider, code },
  } = useRouter();
  const i18n = useI18n();

  useOAuthCodeCallback(provider as OAuthProvider, code as string);

  return (
    <Layout>
      <CenterH className="mt-16">{i18n.t('common.teleportStarting')}</CenterH>
    </Layout>
  );
};

export default OAuthCallbackPage;

export const getServerSideProps = defaultGetServerSideProps;
