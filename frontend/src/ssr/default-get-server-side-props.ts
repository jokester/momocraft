import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { createLogger } from '../util/debug-logger';
import { pickLanguageForReq } from './middleware/cookie-lang';
import { LangCode } from '../const/languages';

const logger = createLogger(__filename);

interface CommonPageProps {
  lang: LangCode;
}

export const defaultGetServerSideProps: GetServerSideProps<CommonPageProps> = async (ctx) => ({
  props: { lang: pickLanguageForReq(ctx.req, ctx.res, LangCode.en, false) },
});
