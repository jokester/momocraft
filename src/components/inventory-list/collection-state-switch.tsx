import React, { useState } from 'react';
import { ItemsV2Json } from '../../json/json';
import { CollectionState, randomCollectionState } from '../../model/collection';
import { Button, ButtonGroup } from '@blueprintjs/core';

export const CollectionStateSwitch: React.FC<{ item: ItemsV2Json.Item }> = props => {
  const [status, setStatus] = useState<CollectionState>(randomCollectionState);
  return (
    <ButtonGroup vertical>
      <Button
        small
        onClick={() => setStatus(CollectionState.own)}
        active={status === CollectionState.own}
        className="text-xl"
        icon="tick-circle"
      >
        拥有
      </Button>
      <Button
        small
        onClick={() => setStatus(CollectionState.with)}
        active={status === CollectionState.with}
        icon="hand"
      >
        想摸
      </Button>
      <Button
        small
        onClick={() => setStatus(CollectionState.none)}
        active={status === CollectionState.none}
        icon="remove"
      >
        取消
      </Button>
    </ButtonGroup>
  );
};
