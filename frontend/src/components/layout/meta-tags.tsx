import React from 'react';
import Head from 'next/head';

export const GlobalMetaTags: React.FC = () => (
  <Head>
    <meta key="meta-http-equiv-content-type" httpEquiv="content-type" content="text/html; charset=utf-8" />
    <meta key="meta-viewport" name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
  </Head>
);

export const MetaTags: React.FC<{
  title?: string;
  desc?: string;
}> = (props) => {
  const title = props.title || 'momocraft';

  return (
    <Head>
      <title key="page-title">{title}</title>
    </Head>
  );
};
