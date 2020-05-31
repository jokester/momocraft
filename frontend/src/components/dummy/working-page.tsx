import { CenterH, Layout } from '../layout/layout';
import React from 'react';
import { PageType } from '../../next-types';
import { useRouter } from 'next/router';

export const WorkingPage: PageType = (props) => {
  const { pathname } = useRouter();
  return (
    <Layout>
      <CenterH className="mt-24">施工中: {pathname}</CenterH>
    </Layout>
  );
};
