import { CenterH, Layout } from '../layout/layout';
import React from 'react';
import { PageType } from '../../next-types';

export const WorkingPage: PageType = props => (
  <Layout>
    <CenterH className="mt-24">施工中: {props.route.pathname}</CenterH>
  </Layout>
);
