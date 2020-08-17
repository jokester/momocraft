import { acThemeColors } from './colors';
import defaultTheme from '@chakra-ui/core/dist/theme';

export const ourTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    ...acThemeColors,
  },
};
