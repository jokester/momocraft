import React, { useMemo } from 'react';
import { dynamicItemsV1 } from '../../json/dynamic-items-v1';
import { usePromised } from '@jokester/ts-commonutil/react/hook/use-promised';
import { ItemsV1Json } from '../../json/json';
import { ItemColumnType } from '../../model/item-id-def';
import { FontAwesomeIcon } from '../icon/fontawesome-icon';

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

  const thead = (
    <thead key={-1}>
      <tr>
        <td>名字</td>
        <td>图片</td>
        <td>变体</td>
        <td>meta</td>
      </tr>
    </thead>
  );

  const tbodyRows = useMemo(
    () =>
      sheet.items.map((item, itemNo) => (
        <tr key={itemNo}>
          <td>
            {/* name */ [
              item[ItemColumnType.nameZhS],
              <br />,
              item[ItemColumnType.nameZhT],
              <br />,
              item[ItemColumnType.nameJa],
              <br />,
              item[ItemColumnType.nameEn],
            ]}
          </td>
          <td>
            {/* pic */}
            <FontAwesomeIcon large iconName="fa-images" />
          </td>
          <td>TODO</td>
          <td>TODO</td>
        </tr>
      )),
    [sheet.items],
  );

  return (
    <div>
      <h2>{sheet.sheetName}</h2>
      <table className="w-full">
        {thead}
        <tbody>{tbodyRows}</tbody>
      </table>
    </div>
  );
};
