import React from 'react';
import { PageType } from '../src/next-types';
import { Layout } from '../src/components/layout/layout';
import { FrontpageIntro } from '../src/components/frontpage/intro';
import { ChangelogList } from '../src/components/frontpage/changelog';
import { PreJson } from '../src/dummy/pre-json';
import { defaultGetServerSideProps } from '../src/ssr/default-get-server-side-props';

const IndexPage: PageType = (props) => {
  return (
    <Layout>
      <FrontpageIntro />
      <ChangelogList />
      <PreJson value={props} />
    </Layout>
  );
};

export default IndexPage;

export const getServerSideProps = defaultGetServerSideProps;
