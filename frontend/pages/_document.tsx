import React from 'react';
import Document, { DocumentContext, DocumentInitialProps, Head, Main, NextScript } from 'next/document';
import { GoogleAnalyticsTag } from '../src/tracking/tracking-tags';
import { createLogger } from '../src/util/debug-logger';
import { inferLanguageForReq } from '../src/ssr/middleware/cookie-lang';
import { LangCode } from '../src/i18n/i18next-factory';
import { isDevBuild } from '../src/config/build-env';

const logger = createLogger(__filename);

interface OurDocumentProps {
  lang: string;
}

export default class CustomDocument extends Document<OurDocumentProps> {
  /**
   * @note only in server
   * @param {DocumentContext} ctx
   * @returns {Promise<OurDocumentProps & DocumentInitialProps>}
   */
  static getInitialProps = async (ctx: DocumentContext) => {
    if (0) {
      logger('docContext', ctx);
    }

    return {
      ...(await Document.getInitialProps(ctx)),
      lang: inferLanguageForReq(ctx.req || null, ctx.res || null, LangCode.en, true).langCode,
    } as OurDocumentProps & DocumentInitialProps;
  };

  render() {
    return (
      <html lang={this.props.lang}>
        <Head>
          <GoogleAnalyticsTag />
          <link
            key="font-awesome"
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css"
            integrity="sha256-+N4/V/SbAFiW1MPBCXnfnP9QSN3+Keu+NlB+0ev/YKQ="
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/tailwindcss@1.4.4/dist/tailwind.min.css"
            integrity="sha256-CAI/7ThhltsmP2L2zKBYa7FknB3ZwFbD0nqL8FCdxdc="
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/@blueprintjs/core@3.26.0/lib/css/blueprint.css"
            integrity="sha256-/i9735G9mgvjeAUMvgwrJaRoGOiZpnCwoWH8tuvPqq4="
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/@blueprintjs/icons@3.15.1/lib/css/blueprint-icons.css"
            integrity="sha256-TCBL18Dgf7kFC0vKWhEaFD+87xslflRbMTAaChRCyTc="
            crossOrigin="anonymous"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1.5,minimum-scale=0.8" />
        </Head>
        <body className="bg-dark">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
