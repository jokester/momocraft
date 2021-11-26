import React, { useMemo } from 'react';
import { PreJson } from '../../dummy/pre-json';
import { useItemsDB } from '../hooks/use-items-db';

export const InventoryShow: React.FC<{ encodedItemId: string }> = ({ encodedItemId }) => {
  const itemsDb = useItemsDB();

  const item = useMemo(
    () => (itemsDb.fulfilled && itemsDb.value.itemsMap.get(encodedItemId)) || null,
    [itemsDb, encodedItemId],
  );

  if (itemsDb.rejected) return <div>ERROR</div>;
  if (itemsDb.pending) return <div>LOADING</div>;
  if (!item) return <div>ITEM NOT FOUND</div>;
  return <PreJson value={item} />;
};
