import '../app.scss';
import { ThemeProvider } from '@chakra-ui/core';
import React from 'react';

export const StoriesWrapper: React.FC = (props) => <ThemeProvider>{props.children}</ThemeProvider>;
