import { ComponentType } from 'react';
import { NextPageContext } from 'next';

type FullPageProps<UrlParam, PerPageProps> = PerPageProps & {
  // injected by _app.tsx
  route: Pick<NextPageContext, 'pathname' | 'asPath'> & { query: UrlParam & Record<string, string> };
};

type PageGetInitialProps<UrlParam = {}, PageProps = {}> = (
  ctx: NextPageContext & { query: UrlParam },
) => PageProps | Promise<PageProps>;

/**
 * TODO: move to next's getServerSideProps etc
 */
export type PageType<UrlParam = {}, PageProps = {}> = ComponentType<FullPageProps<UrlParam, PageProps>> & {
  getInitialProps?: PageGetInitialProps<UrlParam, PageProps>;
};
