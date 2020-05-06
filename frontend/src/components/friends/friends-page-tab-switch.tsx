import React from 'react';
import { CenterH } from '../layout/layout';
import { Button, ButtonGroup } from '@blueprintjs/core';

export const FriendsPageSectionSelector: React.FC<{ current: 0 | 1 | 2; onChange(x: 0 | 1 | 2): void }> = ({
  current,
  onChange,
}) => {
  return (
    <CenterH>
      <ButtonGroup className="flex justify-center space-x-2 w-full sm:w-1/2">
        <Button active={current === 0} text="好友列表" onClick={() => onChange(0)} />
        <Button active={current === 1} text="我想要的" onClick={() => onChange(1)} />
        <Button active={current === 2} text="好友想要的" onClick={() => onChange(2)} />
      </ButtonGroup>
    </CenterH>
  );
};
