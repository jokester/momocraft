module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-viewport',
    'storybook-addon-responsive-views',
  ],
  webpackFinal: async (config) => {
    config.module.rules = config.module.rules
      .filter((existingRule) => !existingRule.test.test('some.css'))
      .concat([
        {
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: require.resolve('ts-loader'),
              options: {
                compilerOptions: {
                  noEmit: false,
                  target: 'es6',
                  module: 'commonjs',
                  jsx: 'react',
                },
              },
            },
            // Optional
            // { loader: require.resolve('react-docgen-typescript-loader'), },
          ],
        },
        {
          test: /\.s?css$/,
          use: [
            'style-loader',
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
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
};
