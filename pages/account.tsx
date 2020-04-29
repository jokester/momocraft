import { PreJson } from '../src/dummy/pre-json';
import { PageType } from '../src/next-types';
import { Layout } from '../src/components/layout/layout';
import { H2 } from '@blueprintjs/core';
import React from 'react';
import { useSingletons } from '../src/internal/app-context';

const AccountPageContent: React.FC = () => {
  const { auth } = useSingletons();

  const x = useObserva;
};

const AccountPage: PageType = props => {
  return (
    <Layout>
      <H2>UnnamedPage in {__filename}</H2>
      <PreJson value={props} />
    </Layout>
  );
};

// AccountPage.getInitialProps = async ctx => ({ });

export default AccountPage;
