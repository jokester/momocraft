import React, { useRef } from 'react';
import App from 'next/app';
import '../src/app.scss';
import { Toaster } from '@blueprintjs/core';
import { AppContextHolder } from '../src/internal/app-context';

const RealApp: React.FC = (props) => {
  const toasterRef = useRef<Toaster>(null!);

  return (
    <>
      <AppContextHolder toasterRef={toasterRef}>{props.children}</AppContextHolder>
      <Toaster ref={toasterRef} position="bottom" />
    </>
  );
};

export default class extends App {
  static getInitialProps = App.getInitialProps;

  render() {
    const { Component } = this.props;

    const { pathname, asPath, query } = this.props.router;
    const pageProps: {} = {
      ...this.props.pageProps,
      route: { pathname, asPath, query },
    };

    return (
      <React.StrictMode>
        <RealApp>
          <Component {...pageProps} />
        </RealApp>
      </React.StrictMode>
    );
  }
}
