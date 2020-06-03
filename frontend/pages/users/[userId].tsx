import { PreJson } from '../../src/dummy/pre-json';
import { PageType } from '../../src/next-types';
import { Layout } from '../../src/components/layout/layout';
import { defaultGetServerSideProps } from '../../src/ssr/default-get-server-side-props';
import { useRouter } from 'next/router';

/**
 * URL params from route (path) and query
 */
interface UrlParam {
  userId: string;
}

const UserShowPage: PageType<UrlParam> = (props) => {
  const {
    query: { userId = 'NULL' },
  } = useRouter();
  return (
    <Layout>
      <h2>TODO: userId={userId}</h2>
      <PreJson value={props} />
    </Layout>
  );
};

// UnnamedPage.getInitialProps = async ctx => ({ });

export default UserShowPage;

export const getServerSideProps = defaultGetServerSideProps;
