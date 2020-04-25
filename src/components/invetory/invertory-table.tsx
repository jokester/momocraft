import React, { useMemo } from 'react';
import { dynamicItemsV1 } from '../../json/dynamic-items-v1';
import { usePromised } from '@jokester/ts-commonutil/react/hook/use-promised';
import { ItemsV1Json } from '../../json/json';
import { ItemColumnType, itemIdDef } from '../../model/item-id-def';
import { FontAwesomeIcon } from '../icon/fontawesome-icon';
import Link from 'next/link';
import { TypedRoutes } from '../../typed-routes';

export const InventoryDb: React.FC = () => {
  const itemsDbP = useMemo(dynamicItemsV1, []);

  const itemsDb = usePromised(itemsDbP);

  if (itemsDb.fulfilled) {
    return (
      <div>
        {itemsDb.value.sheets.map((sheet, i) => (
          <InventoryTableSheet sheet={sheet} sheetIndex={i} key={i} />
        ))}
      </div>
    );
  }
  return <div>LOADING</div>;
};

const tdClass = 'p-2';

const InventoryTableSheet: React.FC<{ sheet: ItemsV1Json.Sheet; sheetIndex: number }> = ({ sheet, sheetIndex }) => {
  if (0 && sheetIndex < 15) {
    // DEBUG: exclude huge sheets
    return null;
  }

  const theadRow = (
    <tr className="text-xl border-blue-300 border-b border-solid">
      <td className={tdClass}>名字</td>
      <td className={tdClass}>图片</td>
      <td className={tdClass}>变体</td>
      <td className={tdClass}>meta</td>
    </tr>
  );

  const tbodyRows = useMemo(() => {
    return sheet.items.map((item, itemNoInSheet) => {
      const link = TypedRoutes.items.show(itemIdDef(sheetIndex, itemNoInSheet));
      return (
        <tr key={itemNoInSheet} className="border-blue-200 border-b border-solid">
          <Link href={link}>
            <td className={`w-1/3 cursor-pointer ${tdClass}`}>
              {/* name */}
              {item[ItemColumnType.nameZhS]}
              <br />
              {item[ItemColumnType.nameZhT]}
              <br />
              {item[ItemColumnType.nameJa]}
              <br />
              {item[ItemColumnType.nameEn]}
            </td>
          </Link>
          <Link href={link}>
            <td className={`cursor-pointer ${tdClass}`}>
              {/* pic */}
              <FontAwesomeIcon large iconName="fa-images" />
            </td>
          </Link>
          <td className={tdClass}>TODO</td>
          <td className={tdClass}>TODO</td>
        </tr>
      );
    });
  }, [sheet.items, sheetIndex]);

  return (
    <div className="p-2 mb-4">
      <h2 className={`text-3xl ${tdClass}`}>{sheet.sheetName}</h2>
      <table className="w-full rounded bg-blue-100 p-4">
        <thead>{theadRow}</thead>
        <tbody>{tbodyRows}</tbody>
      </table>
    </div>
  );
};
