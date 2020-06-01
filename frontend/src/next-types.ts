import { ComponentType } from 'react';
import { NextPageContext } from 'next';
import { LangCode } from './i18n/i18next-factory';

export interface CommonPageProps {
  /**
   * injected by defaultGetServerSideProps (all pages should use that)
   */
  langCode?: LangCode;
}

type FullPageProps<UrlParam, PerPageProps> = PerPageProps & CommonPageProps;

type PageGetInitialProps<UrlParam = {}, PageProps = {}> = (
  ctx: NextPageContext & { query: UrlParam },
) => PageProps | Promise<PageProps>;

/**
 * TODO: move to next's getServerSideProps etc
 */
export type PageType<UrlParam = {}, PageProps = {}> = ComponentType<FullPageProps<UrlParam, PageProps>> & {
  getInitialProps?: PageGetInitialProps<UrlParam, PageProps>;
};
