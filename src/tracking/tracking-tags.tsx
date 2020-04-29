import React from 'react';
import { buildEnv } from '../config/build-env';

/**
 * taken from https://github.com/zeit/next.js/blob/canary/examples/with-google-analytics/pages/_document.js
 * @returns {any}
 * @constructor
 */
export const GoogleAnalyticsTag: React.FC = () => {
  const { GA_TRACKING_ID } = buildEnv;

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
