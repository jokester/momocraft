import React, { useMemo } from 'react';
import { dynamicItemsV1 } from '../../json/dynamic-items-v1';
import { usePromised } from '@jokester/ts-commonutil/react/hook/use-promised';
import { ItemsV1Json } from '../../json/json';

export const InventoryDb: React.FC = () => {
  const itemsDbP = useMemo(dynamicItemsV1, []);

  const itemsDb = usePromised(itemsDbP);

  if (itemsDb.fulfilled) {
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
  const columns = sheet.headers;
  if (!columns) return null;

  const th = <thead>{}</thead>;
  return (
    <div>
      <h2>{sheet.sheetName}</h2>
    </div>
  );
};

function columnsToShow(columnName?: string) {
  switch(columnName) {
    case '';

      简体中文: string;
      繁体中文: string;
      日文: string;
      英文: string;
      类型?: string;
      序号?: string;
      颜色?: string;

  }


}
