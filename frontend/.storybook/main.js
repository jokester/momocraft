module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-viewport',
    // '@storybook/addon-docs',
    'storybook-addon-responsive-views',
  ],
  webpackFinal: async (config) => {
    config.module.rules = config.module.rules
      .filter((existingRule) => !existingRule.test.test('some.css'))
      .concat([
        {
          test: /\.s?css$/,
          use: [
            'style-loader',
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                modules: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [require('tailwindcss'), require('autoprefixer')],
                sourceMap: false,
              },
            },
            {
              loader: 'sass-loader',
              options: {},
            },
          ],
        },
      ]);
    return config;
  },
};
