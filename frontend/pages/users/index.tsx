import React from 'react';
import { WorkingPage } from '../../src/components/dummy/working-page';
import { defaultGetServerSideProps } from '../../src/ssr/default-get-server-side-props';

export default WorkingPage;

export const getServerSideProps = defaultGetServerSideProps;
