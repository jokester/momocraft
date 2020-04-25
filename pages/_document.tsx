import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class CustomDocument extends Document {
  render() {
    return (
      <html lang="zh-CN">
        <Head>
          <link
            key="font-awesome"
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css"
            integrity="sha256-+N4/V/SbAFiW1MPBCXnfnP9QSN3+Keu+NlB+0ev/YKQ="
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/1.3.5/tailwind.css"
            integrity="sha256-SRNuJFvxpvNe8ECgkgQlcrxElNwUe1vZ+DKqwcxw6Dc="
            crossOrigin="anonymous"
          />
        </Head>
        <body className="bg-dark">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
