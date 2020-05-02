import React, { useState } from 'react';
import { ItemsV2Json } from '../../json/json';
import { CollectionState, randomCollectionState } from '../../model/collection';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { createLogger } from '../../util/debug-logger';
import { CollectionStateMap, useCollectionApi } from '../hooks/use-collections-api';

const logger = createLogger(__filename);

export const CollectionStateSwitch: React.FC<{ item: ItemsV2Json.Item; collectionMap: null | CollectionStateMap }> = ({
  item,
  collectionMap,
}) => {
  const [state, api, saving] = useCollectionApi(item.itemName, collectionMap);
  return (
    <ButtonGroup vertical>
      <Button
        small
        onClick={() => api.setState(CollectionState.own)}
        active={state === CollectionState.own}
        className="text-xl"
        icon="tick-circle"
      >
        拥有
      </Button>
      <Button
        small
        onClick={() => api.setState(CollectionState.with)}
        active={state === CollectionState.with}
        icon="hand"
      >
        想摸
      </Button>
      <Button
        small
        onClick={() => api.setState(CollectionState.none)}
        active={state === CollectionState.none}
        icon="remove"
      >
        取消
      </Button>
    </ButtonGroup>
  );
};
