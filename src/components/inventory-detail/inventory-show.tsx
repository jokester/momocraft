import React, { useMemo } from 'react';
import { itemIdExtract } from '../../model/item-id-def';
import { PreJson } from '../../dummy/pre-json';
import { useItemsDB } from '../hooks/use-items-db';

export const InventoryShow: React.FC<{ encodedItemId: string }> = ({ encodedItemId }) => {
  const itemId = useMemo(() => itemIdExtract(encodedItemId), [encodedItemId]);
  const itemsDb = useItemsDB();

  const item = useMemo(
    () => itemId && itemsDb.fulfilled && itemsDb.value.sheets[itemId.sheetIndex]?.items?.[itemId.itemIndexInSheet],
    [itemsDb, itemId],
  );

  if (itemsDb.rejected) return <div>ERROR</div>;
  if (itemsDb.pending) return <div>LOADING</div>;
  if (!item) return <div>ITEM NOT FOUND</div>;
  return <PreJson value={item} />;
};
