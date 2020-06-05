import React, { useRef } from 'react';
import App, { AppContext } from 'next/app';
import '../src/app.scss';
import { Toaster } from '@blueprintjs/core';
import { AppContextHolder } from '../src/internal/app-context';
import { createLogger } from '../src/util/debug-logger';
import { CommonPageProps } from '../src/next-types';
import { pickLanguageForReq } from '../src/ssr/middleware/cookie-lang';
import { LangCode } from '../src/const/languages';

const logger = createLogger(__filename);

const RealApp: React.FC<CommonPageProps> = (props) => {
  const toasterRef = useRef<Toaster>(null!);

  logger('initialLang', props.lang);

  return (
    <AppContextHolder toasterRef={toasterRef} initialLang={props.lang}>
      {props.children}
      <Toaster ref={toasterRef} position="bottom" />
    </AppContextHolder>
  );
};

export default class extends App<CommonPageProps> {
  static getInitialProps = async (ctx: AppContext) => {
    // logger('appContext', ctx);

    return {
      pageProps: {
        ...(await App.getInitialProps(ctx)).pageProps,
        lang: pickLanguageForReq(ctx.ctx.req, ctx.ctx.res, LangCode.en, false),
      } as CommonPageProps,
    };
  };

  render() {
    const { Component } = this.props;

    logger('pageProps', this.props.pageProps);

    return (
      <React.StrictMode>
        <RealApp lang={(this.props.pageProps as CommonPageProps).lang}>
          <Component {...this.props} />
        </RealApp>
      </React.StrictMode>
    );
  }
}
