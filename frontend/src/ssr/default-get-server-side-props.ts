import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { createLogger } from '../util/debug-logger';
import { inferLanguageForReq } from './middleware/cookie-lang';
import { LangCode } from '../i18n/i18next-factory';

const logger = createLogger(__filename);

export const defaultGetServerSideProps: GetServerSideProps = async (ctx) => ({ props: {} });

function unused(ctx: GetServerSidePropsContext) {
  logger('req headers', ctx.req.headers);

  return {
    props: {
      ...inferLanguageForReq(ctx.req, ctx.res, LangCode.en, false),
    },
  } as const;
}
