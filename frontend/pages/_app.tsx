import React, { useRef } from 'react';
import App from 'next/app';
import '../src/app.scss';
import { Toaster } from '@blueprintjs/core';
import { AppContextHolder } from '../src/internal/app-context';
import { createLogger } from '../src/util/debug-logger';
import { CommonPageProps } from '../src/next-types';

const logger = createLogger(__filename);

const RealApp: React.FC<CommonPageProps> = (props) => {
  const toasterRef = useRef<Toaster>(null!);

  logger('initialLang', props.langCode);

  return (
    <AppContextHolder toasterRef={toasterRef} initialLang={props.langCode}>
      {props.children}>
      <Toaster ref={toasterRef} position="bottom" />
    </AppContextHolder>
  );
};

export default class extends App<CommonPageProps> {
  static getInitialProps = App.getInitialProps;

  render() {
    const { Component } = this.props;

    logger('pageProps', this.props.pageProps);

    return (
      <React.StrictMode>
        <RealApp langCode={(this.props.pageProps as CommonPageProps).langCode}>
          <Component {...this.props.pageProps} />
        </RealApp>
      </React.StrictMode>
    );
  }
}
