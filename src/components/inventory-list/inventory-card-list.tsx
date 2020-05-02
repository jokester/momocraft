import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { TypedRoutes } from '../../typed-routes';
import { ItemsV2Json } from '../../json/json';
import { createAspectRatioStyle } from '../../style/aspect-ratio';
import { CollectionStateSwitch } from './collection-state-switch';
import { ItemUtils } from '../../json/item-utils';
import { CollectionStateMap, useFetchedCollections } from '../hooks/use-collections-api';

const InventoryCard: React.FunctionComponent<{ item: ItemsV2Json.Item; collectionMap: null | CollectionStateMap }> = ({
  item,
  collectionMap,
}) => {
  const title = useMemo(() => ItemUtils.extractDisplayName(item), [item]);

  return (
    <div className="inline-block my-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/5 h-32">
      <div
        className="model-cell bg-blue-100 border border-solid border-blue-300 my-1 mx-2 h-full flex-col rounded-lg p-2"
        style={createAspectRatioStyle(16 / 10)}
      >
        <div className="flex justify-between align-baseline">
          <h3 className="text-xl inline-block">{title}</h3>
          <Link href={TypedRoutes.items.show2(item)}>查看详细</Link>
        </div>
        <div className="flex mt-2 justify-around">
          <img
            src="https://dummyimage.com/400x300/cff/000"
            alt="image"
            className="max-h-full h-20 object-cover inline-block bg-blue-200 mr-2"
          />
          <CollectionStateSwitch item={item} collectionMap={collectionMap} />
        </div>
      </div>
    </div>
  );
};

export const DummyModelListHeader: React.FunctionComponent<{ title: string }> = ({ title }) => (
  <h3 className="px-2 my-1 font-bold ">{title}</h3>
);

export const InventoryCardList: React.FunctionComponent<{ items: ItemsV2Json.Item[] }> = props => {
  const fetchedCollections = useFetchedCollections();

  const collections = fetchedCollections.fulfilled && fetchedCollections.value;
  return (
    <div className="flex flex-wrap mx-2 -mt-2 z-0">
      {props.items.map((_, i) => (
        <InventoryCard item={_} key={_.itemName} collectionMap={collections} />
      ))}
    </div>
  );
};
