import { acThemeColors } from './colors';

import { extendTheme } from '@chakra-ui/react';

export const ourTheme = extendTheme({
  colors: {
    ...acThemeColors,
  },
});
