import React, { useMemo } from 'react';
import { dynamicItemsV1 } from '../../json/dynamic-items-v1';
import { itemIdExtract } from '../../model/item-id-def';
import { usePromised } from '@jokester/ts-commonutil/react/hook/use-promised';
import { PreJson } from '../../dummy/pre-json';

export const InventoryShow: React.FC<{ encodedItemId: string }> = ({ encodedItemId }) => {
  const itemId = useMemo(() => itemIdExtract(encodedItemId), [encodedItemId]);
  const itemsDbP = useMemo(dynamicItemsV1, []);
  const itemsDb = usePromised(itemsDbP);

  const item = useMemo(
    () => itemId && itemsDb.fulfilled && itemsDb.value.sheets[itemId.sheetIndex]?.items?.[itemId.itemIndexInSheet],
    [itemsDb, itemId],
  );

  if (itemsDb.rejected) return <div>ERROR</div>;
  if (itemsDb.pending) return <div>LOADING</div>;
  if (!item) return <div>ITEM NOT FOUND</div>;
  return <PreJson value={item} />;
};
