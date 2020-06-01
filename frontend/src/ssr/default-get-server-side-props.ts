import { GetServerSideProps } from 'next';
import { createLogger } from '../util/debug-logger';
import { inferLangForCookie } from './middleware/cookie-lang';

const logger = createLogger(__filename);

export const defaultGetServerSideProps: GetServerSideProps = async (ctx) => {
  logger('req headers', ctx.req.headers);

  return {
    props: {
      ...inferLangForCookie(ctx.req, ctx.res),
    },
  } as const;
};
