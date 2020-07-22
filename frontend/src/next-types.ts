import { ComponentType } from 'react';
import { NextPageContext } from 'next';
import { LangCode } from './const/languages';
import { ObjLike } from './util/types';

export interface CommonPageProps {
  /**
   * injected by _app.tsx (all pages should use that)
   */
  lang: LangCode;
}

type FullPageProps<UrlParam, PerPageProps> = PerPageProps & CommonPageProps;

type PageGetInitialProps<UrlParam = ObjLike, PageProps = ObjLike> = (
  ctx: NextPageContext & { query: UrlParam },
) => PageProps | Promise<PageProps>;

export type PageType<UrlParam = ObjLike, PageProps = ObjLike> = ComponentType<FullPageProps<UrlParam, PageProps>> & {
  getInitialProps?: PageGetInitialProps<UrlParam, PageProps>;
};
