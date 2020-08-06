import React from 'react';
import { Button } from '@chakra-ui/core';

const HeaderButton: React.FC<unknown> = (props) => <Button backgroundColor="ac-pink.900">{props.children}</Button>;

export const Header: React.FC = (props) => {
  return (
    <div className="bg-ac-green-500 h-64 space-x-2 p-2">
      <HeaderButton>btn1</HeaderButton>
      <HeaderButton>btn2</HeaderButton>
    </div>
  );
};
