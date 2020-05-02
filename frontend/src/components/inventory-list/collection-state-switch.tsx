import React from 'react';
import { ItemsV2Json } from '../../items-db/json-schema';
import { CollectionState } from '../../model/collection';
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
        onClick={() => {
          if (state !== CollectionState.own) {
            api.setState(CollectionState.own);
          } else {
            api.setState(CollectionState.none);
          }
        }}
        active={state === CollectionState.own}
        loading={saving}
        className="text-xl"
        icon="tick-circle"
      >
        拥有
      </Button>
      <Button
        small
        loading={saving}
        onClick={() => {
          if (state !== CollectionState.want) {
            api.setState(CollectionState.want);
          } else {
            api.setState(CollectionState.none);
          }
        }}
        active={state === CollectionState.want}
        icon="hand"
      >
        想摸
      </Button>
    </ButtonGroup>
  );
};
