import React from 'react';
import { Button } from '@chakra-ui/react';
import headerStyle from './header.module.scss';

import classNames from 'classnames';

const HeaderButton: React.FC<unknown> = (props) => (
  <Button size="sm" color="ac-pink.900">
    {props.children}
  </Button>
);

export const Header: React.FC<{ themeClass?: string }> = (props) => {
  return (
    <div className={classNames(headerStyle.header, props.themeClass)}>
      <div className={classNames('p-2', headerStyle.toolbar)}>
        <HeaderButton>btn1</HeaderButton>
        <HeaderButton>btn2</HeaderButton>
      </div>
      <div className={headerStyle.decoration} />
    </div>
  );
};
