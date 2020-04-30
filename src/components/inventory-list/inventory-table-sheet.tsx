import React, { useMemo } from 'react';
import { ItemsV2Json } from '../../json/json';
import { TypedRoutes } from '../../typed-routes';
import { ItemColumnType, itemIdDef } from '../../model/item-id-def';
import Link from 'next/link';
import { FontAwesomeIcon } from '../icon/fontawesome-icon';
import { CollectionStateSwitch } from './collection-state-switch';

const tdClass = 'p-2';

export const InventoryTableSheet: React.FC<{ sheets: ItemsV2Json.Sheet[]; sheetIndex: number }> = ({
  sheets,
  sheetIndex,
}) => {
  const currentSheet = useMemo(() => sheets.find((_, i) => i === sheetIndex), [sheets, sheetIndex]);

  const theadRow = (
    <tr className="text-xl border-blue-300 border-b border-solid">
      <td className={tdClass}>名字</td>
      <td className={tdClass}>图片</td>
      <td className={tdClass}>变体</td>
      <td className={tdClass}>meta</td>
      <td className={tdClass}>我的状态</td>
    </tr>
  );

  const tbodyRows = useMemo(() => {
    return currentSheet?.items.map((item, itemNoInSheet) => {
      const link = TypedRoutes.items.show(itemIdDef(sheetIndex, itemNoInSheet));
      return (
        <tr key={link} className="border-blue-200 border-b border-solid">
          <Link href={link}>
            <td className={`w-1/3 cursor-pointer ${tdClass}`}>
              {/* name */}
              {item.base[ItemColumnType.nameZhS]}
              <br />
              {item.base[ItemColumnType.nameZhT]}
              <br />
              {item.base[ItemColumnType.nameJa]}
              <br />
              {item.base[ItemColumnType.nameEn]}
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
          <td className={tdClass}>
            <CollectionStateSwitch item={item} />
          </td>
        </tr>
      );
    });
  }, [currentSheet?.items, sheetIndex]);

  return (
    <div className="p-2 mb-4">
      <h2 className={`text-3xl ${tdClass}`}>{currentSheet?.sheetName ?? 'CATEGORY_NOT_SELECTED'}</h2>
      <table className="w-full rounded bg-blue-100 p-4">
        <thead>{theadRow}</thead>
        <tbody>{tbodyRows}</tbody>
      </table>
    </div>
  );
};
