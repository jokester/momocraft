import React from 'react';
import Link from 'next/link';
import { TypedRoutes } from '../../typed-routes';
import { ItemsV2Json } from '../../json/json';
import { createAspectRatioStyle } from '../../style/aspect-ratio';

const InventoryCard: React.FunctionComponent<{ item: ItemsV2Json.Item }> = props => (
  <Link href={TypedRoutes.index}>
    <div className="inline-block my-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 h-32">
      <div
        className="model-cell bg-blue-900 my-1 mx-2 h-full flex-col rounded-lg"
        style={createAspectRatioStyle(16 / 10)}
      >
        <div className="bg-gray-100" />
        <div className="bg-gray-200 " />
      </div>
    </div>
  </Link>
);

export const DummyModelListHeader: React.FunctionComponent<{ title: string }> = ({ title }) => (
  <h3 className="px-2 my-1 font-bold ">{title}</h3>
);

export const InventoryCardList: React.FunctionComponent<{ items: ItemsV2Json.Item[] }> = props => (
  <div className="flex flex-wrap mx-2 -mt-2">
    {props.items.map((_, i) => (
      <InventoryCard item={_} key={i} />
    ))}
  </div>
);
