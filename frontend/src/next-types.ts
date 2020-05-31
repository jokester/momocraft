import { ComponentType } from 'react';
import { NextPageContext } from 'next';
import { LangCode } from './i18n/init-i18n';

type FullPageProps<UrlParam, PerPageProps> = PerPageProps & {
  /**
   * injected by defaultGetServerSideProps (all pages should use that)
   */
  langCode?: LangCode;
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
