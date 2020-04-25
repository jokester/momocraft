import React, { useMemo } from 'react';
import { dynamicItemsV1 } from '../../json/dynamic-items-v1';
import { usePromised } from '@jokester/ts-commonutil/react/hook/use-promised';
import { ItemsV1Json } from '../../json/json';

export const InventoryDb: React.FC = () => {
  const itemsDbP = useMemo(dynamicItemsV1, []);

  const itemsDb = usePromised(itemsDbP);

  if (itemsDb.fulfilled) {
    if (1) {
      console.log(itemsDb);
    }
    return (
      <div>
        {itemsDb.value.sheets.map((sheet, i) => (
          <InventoryTableSheet sheet={sheet} key={i} />
        ))}
      </div>
    );
  }
  return <div>LOADING</div>;
};

const InventoryTableSheet: React.FC<{ sheet: ItemsV1Json.Sheet }> = ({ sheet }) => {
  return (
    <div>
      <h2>{sheet.sheetName}</h2>
    </div>
  );
};
