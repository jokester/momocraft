import { PageType } from '../src/next-types';
import { Layout } from '../src/components/layout/layout';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { TypedRoutes } from '../src/typed-routes';
import { defaultGetServerSideProps } from '../src/ssr/default-get-server-side-props';

const NotFoundPage: PageType = (props) => {
  const router = useRouter();
  useEffect(() => {
    router.replace(TypedRoutes.index);
  }, []);
  return <Layout>还没做</Layout>;
};

export default NotFoundPage;

export const getServerSideProps = defaultGetServerSideProps;
