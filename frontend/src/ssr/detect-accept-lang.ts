import { GetServerSideProps } from 'next';
import { LangCode, LangMap } from '../i18n/init-i18n';
import { parse as parseHttpAcceptLang } from 'accept-language-parser';
import { createLogger } from '../util/debug-logger';

const logger = createLogger(__filename);

export const defaultGetServerSideProps: GetServerSideProps = async (ctx) => {
  logger('req headers', ctx.req.headers);
  ctx.res.setHeader('set-cookie', `date=${Date.now()}`);
  return {
    props: {
      acceptLang: parseAcceptLang(ctx.req.headers['accept-language']),
    },
  } as const;
};

function parseAcceptLang(lang?: string): LangCode {
  for (const specified of parseHttpAcceptLang(lang || ''))
    for (const [re, lang] of LangMap) {
      if (re.exec(`${specified.code}-${specified.region}`)) {
        return lang;
      }
    }

  return LangCode.en;
}
