import { CenterH, Layout } from '../layout/layout';
import React from 'react';

export const WorkingPage: React.FC = () => (
  <Layout>
    <CenterH className="mt-24">施工中: {location.pathname}</CenterH>
  </Layout>
);
