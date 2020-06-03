import { PreJson } from '../../src/dummy/pre-json';
import { PageType } from '../../src/next-types';
import { Layout } from '../../src/components/layout/layout';
import { InventoryShow } from '../../src/components/inventory-detail/inventory-show';
import { defaultGetServerSideProps } from '../../src/ssr/default-get-server-side-props';
import { useRouter } from 'next/router';
import React from 'react';

/**
 * URL params from route (path) and query
 */
interface UrlParam {
  itemId: string;
}

const UnnamedPage: PageType<UrlParam> = (props) => {
  const {
    query: { itemId = 'NULL' },
  } = useRouter();
  return (
    <Layout>
      <h2>TODO: itemId={itemId}</h2>
      <InventoryShow encodedItemId={itemId as string} />
      <PreJson value={props} />
    </Layout>
  );
};

// UnnamedPage.getInitialProps = async ctx => ({ });

export default UnnamedPage;

export const getServerSideProps = defaultGetServerSideProps;
