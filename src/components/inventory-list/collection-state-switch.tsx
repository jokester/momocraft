import React, { useState } from 'react';
import { ItemsV2Json } from '../../json/json';
import { PossessionState, randomPossessionState } from '../../model/item-possession';
import { Button, ButtonGroup } from '@blueprintjs/core';

export const CollectionStateSwitch: React.FC<{ item: ItemsV2Json.Item }> = props => {
  const [status, setStatus] = useState<PossessionState>(randomPossessionState);
  return (
    <ButtonGroup fill vertical>
      <Button onClick={() => setStatus(PossessionState.own)} active={status === PossessionState.own} icon="tick-circle">
        拥有
      </Button>
      <Button onClick={() => setStatus(PossessionState.with)} active={status === PossessionState.with} icon="hand">
        想摸
      </Button>
      <Button onClick={() => setStatus(PossessionState.none)} active={status === PossessionState.none} icon="remove">
        取消
      </Button>
    </ButtonGroup>
  );
};
