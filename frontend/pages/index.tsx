import React from 'react';
import { PageType } from '../src/next-types';
import { Layout } from '../src/components/layout/layout';
import { FrontpageIntro } from '../src/components/frontpage/intro';
import { ChangelogList } from '../src/components/frontpage/changelog';

const IndexPage: PageType = props => {
  return (
    <Layout>
      <FrontpageIntro />
      <ChangelogList />
    </Layout>
  );
};

// IndexPage.getInitialProps = async ctx => ({});

export default IndexPage;
