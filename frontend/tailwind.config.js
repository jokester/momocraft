// eslint-disable-next-line @typescript-eslint/no-var-requires
const ourColors = require('./src/style/colors').acThemeColors;

module.exports = {
  purge: ['./src/**/*.html', './src/**/*.jsx', './src/**/*.js', './src/**/*.tsx', './pages/**/*.tsx', './src/**/*.ts'],
  theme: {
    extend: {
      colors: { ...ourColors },
    },
  },
  variants: {},
  plugins: [],
};
