// import '../app.scss';
import { ThemeProvider } from '@chakra-ui/core';
import React from 'react';
import { ourTheme } from '../style/chakra-theme';

export const StoriesWrapper: React.FC = (props) => <ThemeProvider theme={ourTheme}>{props.children}</ThemeProvider>;
