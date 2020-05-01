import React, { useState } from 'react';
import { ItemsV2Json } from '../../json/json';
import { PossessionState, randomPossessionState } from '../../model/item-possession';
import { Button, ButtonGroup } from '@blueprintjs/core';

export const CollectionStateSwitch: React.FC<{ item: ItemsV2Json.Item }> = props => {
  const [status, setStatus] = useState<PossessionState>(randomPossessionState);
  return (
    <ButtonGroup vertical>
      <Button
        small
        onClick={() => setStatus(PossessionState.own)}
        active={status === PossessionState.own}
        className="text-xl"
        icon="tick-circle"
      >
        拥有
      </Button>
      <Button
        small
        onClick={() => setStatus(PossessionState.with)}
        active={status === PossessionState.with}
        icon="hand"
      >
        想摸
      </Button>
      <Button
        small
        onClick={() => setStatus(PossessionState.none)}
        active={status === PossessionState.none}
        icon="remove"
      >
        取消
      </Button>
    </ButtonGroup>
  );
};
