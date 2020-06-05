import { ComponentType } from 'react';
import { NextPageContext } from 'next';
import { LangCode } from './const/languages';

export interface CommonPageProps {
  /**
   * injected by _app.tsx (all pages should use that)
   */
  lang: LangCode;
}

type FullPageProps<UrlParam, PerPageProps> = PerPageProps & CommonPageProps;

type PageGetInitialProps<UrlParam = {}, PageProps = {}> = (
  ctx: NextPageContext & { query: UrlParam },
) => PageProps | Promise<PageProps>;

export type PageType<UrlParam = {}, PageProps = {}> = ComponentType<FullPageProps<UrlParam, PageProps>> & {
  getInitialProps?: PageGetInitialProps<UrlParam, PageProps>;
};
