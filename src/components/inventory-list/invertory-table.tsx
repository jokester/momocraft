import React, { useState } from 'react';
import { useItemsDB } from '../hooks/use-items-db';
import { createLogger } from '../../util/debug-logger';
import { InventoryCategoryPicker } from './inventory-category-picker';
import { InventoryTableSheet } from './inventory-table-sheet';
import { InventoryCardList } from './inventory-card-list';

const logger = createLogger(__filename);

export const InventoryDb: React.FC = () => {
  const itemsDb = useItemsDB();

  const [currentSheetId, setSheetId] = useState(2);

  logger('InventoryDb', itemsDb, currentSheetId);

  if (itemsDb.fulfilled) {
    return (
      <div>
        <InventoryCategoryPicker sheets={itemsDb.value.sheets} curentSheetId={currentSheetId} setSheetId={setSheetId} />
        <InventoryCardList key={currentSheetId} items={itemsDb?.value?.sheets?.[currentSheetId]?.items ?? []} />
      </div>
    );
  }
  return <div>LOADING</div>;
};
