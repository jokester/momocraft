import { GetServerSideProps } from 'next';
import { createLogger } from '../util/debug-logger';
import { handleLangCookieAndReturnLanguage } from './middleware/cookie-lang';

const logger = createLogger(__filename);

export const defaultGetServerSideProps: GetServerSideProps = async (ctx) => {
  logger('req headers', ctx.req.headers);

  return {
    props: {
      ...handleLangCookieAndReturnLanguage(ctx),
    },
  } as const;
};
