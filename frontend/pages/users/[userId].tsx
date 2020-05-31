import { PreJson } from '../../src/dummy/pre-json';
import { PageType } from '../../src/next-types';
import { Layout } from '../../src/components/layout/layout';
import { InventoryShow } from '../../src/components/inventory-detail/inventory-show';
import { defaultGetServerSideProps } from '../../src/ssr/default-get-server-side-props';

/**
 * URL params from route (path) and query
 */
interface UrlParam {
  userId: string;
}

const UserShowPage: PageType<UrlParam> = (props) => {
  const {
    route: {
      query: { itemId = 'NULL' },
    },
  } = props;
  return (
    <Layout>
      <h2>TODO: itemId={itemId}</h2>
      <InventoryShow encodedItemId={itemId} />
      <PreJson value={props} />
    </Layout>
  );
};

// UnnamedPage.getInitialProps = async ctx => ({ });

export default UserShowPage;

export const getServerSideProps = defaultGetServerSideProps;
