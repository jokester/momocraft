import React, { useEffect } from 'react';
import Router from 'next/router';
import { buildEnv } from '../config/build-env';

declare function gtag(...args: any[]): void;

/**
 * taken from https://github.com/zeit/next.js/blob/canary/examples/with-google-analytics/pages/_document.js
 * @returns {any}
 * @constructor
 */
export const GoogleAnalyticsTag: React.FC = () => {
  const { GA_TRACKING_ID } = buildEnv;

  useEffect(() => {
    if (GA_TRACKING_ID) {
      Router.events.on('routeChangeComplete', url => {
        setTimeout(() => {
          typeof gtag === 'function' &&
            gtag('config', GA_TRACKING_ID, {
              page_location: url,
              page_title: document.title,
            });
        }, 0);
      });
    }
  }, []);

  return (
    (GA_TRACKING_ID && (
      <>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
      </>
    )) ||
    null
  );
};
