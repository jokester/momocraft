import { PreJson } from '../../src/dummy/pre-json';
import { PageType } from '../../src/next-types';
import { Layout } from '../../src/components/layout/layout';
import { defaultGetServerSideProps } from '../../src/ssr/default-get-server-side-props';
import { useRouter } from 'next/router';
import React from 'react';
import { OAuthProvider } from '../../src/const-shared/oauth-conf';
import { DiscordLoginButton } from '../../src/components/auth/oauth-login-button';
import { useOAuthCodeCallback } from '../../src/components/auth/oauth-code-responder';

interface UrlParam {
  provider: OAuthProvider;
  code?: string;
}

const OAuthCallbackPage: PageType<UrlParam> = (props) => {
  const {
    query,
    query: { provider, code },
  } = useRouter();

  useOAuthCodeCallback(provider as OAuthProvider, code as string);

  return (
    <Layout>
      <DiscordLoginButton />
      <PreJson value={query} />
    </Layout>
  );
};

export default OAuthCallbackPage;

export const getServerSideProps = defaultGetServerSideProps;
