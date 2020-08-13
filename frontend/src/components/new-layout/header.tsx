import React from 'react';
import { Button } from '@chakra-ui/core';

import transitionTheme from './transition-theme.module.scss';
import classNames from 'classnames';

export { transitionTheme };

const HeaderButton: React.FC<unknown> = (props) => (
  <Button size="sm" color="ac-pink.900">
    {props.children}
  </Button>
);

export const Header: React.FC<{ themeClass?: string }> = (props) => {
  return (
    <div className={classNames('p-4 ', transitionTheme.transitionThemed, props.themeClass)}>
      <HeaderButton>btn1</HeaderButton>
      <HeaderButton>btn2</HeaderButton>
    </div>
  );
};
