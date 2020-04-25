const withPlugins = require('next-compose-plugins');

const webpack = require('webpack');
const withSourceMap = require('@zeit/next-source-maps');
const optimizedImages = require('next-optimized-images');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const withTM = require('next-transpile-modules');

const nextConf = {
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      // reportFilename: '../bundles/server.html'
    },
    browser: {
      analyzerMode: 'static',
      // reportFilename: '../bundles/client.html'
    },
  },

  // see https://nextjs.org/docs/#customizing-webpack-config
  webpack(config, { buildId, dev, isServer }) {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_DEV': JSON.stringify(!!dev),
        'process.env.NEXT_SERVER': JSON.stringify(!!isServer),
      }),
    );

    config.plugins = config.plugins.map(p => {
      return p;
    });

    config.node = {
      ...config.node,
      __filename: true,
    };

    return config;
  },
};


module.exports = withPlugins(
  [
    [optimizedImages, { optimizeImages: false }],
    [withBundleAnalyzer],
    // [withSourceMap],  // this does not work
    [withTM, { transpileModules: ['lodash-es', '@jokester/ts-commonutil',] }],
  ],
  withSourceMap(nextConf),
);
