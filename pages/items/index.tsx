import { PreJson } from '../../src/dummy/pre-json';
import { PageType } from '../../src/next-types';
import { Layout } from "../../src/components/layout/layout";

/**
 * URL params from route (path) and query
 */
interface UrlParam {
}

/**
 *
 */
interface PageProps {
}

const ItemsIndexPage: PageType<UrlParam, PageProps> = props => {
  return (
    <Layout>
      <h2>UnnamedPage in {__filename}</h2>
      <PreJson value={props} />
    </Layout>
  );
};

// UnnamedPage.getInitialProps = async ctx => ({ });

export default ItemsIndexPage;
