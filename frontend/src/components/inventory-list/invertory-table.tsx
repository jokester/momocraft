import React, { useMemo, useState } from 'react';
import { useItemsDB } from '../hooks/use-items-db';
import { createLogger } from '../../util/debug-logger';
import { InventoryCategoryPicker } from './inventory-category-picker';
import { InventoryCard, InventoryCartListView } from './inventory-card-list';

const logger = createLogger(__filename);

export const InventoryDb: React.FC = () => {
  const itemsDb = useItemsDB();

  const [currentSheetId, setSheetId] = useState(0);

  logger('InventoryDb', itemsDb, currentSheetId);

  const items = useMemo(() => (itemsDb.fulfilled && itemsDb.value?.sheets?.[currentSheetId]?.items) || [], [
    itemsDb,
    currentSheetId,
  ]);

  if (itemsDb.fulfilled) {
    return (
      <div>
        <InventoryCategoryPicker sheets={itemsDb.value.sheets} curentSheetId={currentSheetId} setSheetId={setSheetId} />
        <InventoryCartListView key={currentSheetId}>
          {items.map((item, i) => (
            <InventoryCard key={item.itemId} item={item} collectionMap={null} />
          ))}
        </InventoryCartListView>
      </div>
    );
  }
  return <div>LOADING</div>;
};
