import React, { useMemo, useState } from 'react';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { ItemsV1Json } from '../../json/json';
import { ItemColumnType, itemIdDef } from '../../model/item-id-def';
import { FontAwesomeIcon } from '../icon/fontawesome-icon';
import Link from 'next/link';
import { TypedRoutes } from '../../typed-routes';
import { useItemsDB } from '../hooks/use-items-db';
import { RenderArray } from '../hoc/render-array';
import { createLogger } from '../../util/debug-logger';
import { OccupationStatus, rollOccupationStatus } from '../../model/occupation';

const logger = createLogger(__filename);

export const InventoryDb: React.FC = () => {
  const itemsDb = useItemsDB();

  const [currentSheetId, setSheetId] = useState(2);

  logger('InventoryDb', itemsDb, currentSheetId);

  if (itemsDb.fulfilled) {
    return (
      <div>
        <SheetPicker sheets={itemsDb.value.sheets} curentSheetId={currentSheetId} setSheetId={setSheetId} />
        <InventoryTableSheet sheets={itemsDb.value.sheets} sheetIndex={currentSheetId} />
      </div>
    );
  }
  return <div>LOADING</div>;
};

const tdClass = 'p-2';

export const SheetPicker: React.FC<{
  sheets: ItemsV1Json.Sheet[];
  curentSheetId: number;
  setSheetId(sheetId: number): void;
}> = props => {
  return (
    <div>
      物品种类: &nbsp;
      <select value={props.curentSheetId} onChange={ev => props.setSheetId(Number(ev.target.value))}>
        <option value={-1}>未选择</option>
        <RenderArray items={props.sheets}>
          {(item, index) => (
            <option value={index} key={index}>
              {item.sheetName}
            </option>
          )}
        </RenderArray>
      </select>
    </div>
  );
};

const InventoryTableSheet: React.FC<{ sheets: ItemsV1Json.Sheet[]; sheetIndex: number }> = ({ sheets, sheetIndex }) => {
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
          <td className={tdClass}>
            <StatusColumn item={item} />
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

const StatusColumn: React.FC<{ item: ItemsV1Json.Item }> = props => {
  const [status, setStatus] = useState<OccupationStatus>(rollOccupationStatus);
  return (
    <ButtonGroup fill>
      <Button onClick={() => setStatus(OccupationStatus.own)} active={status === OccupationStatus.own}>
        拥有
      </Button>
      <Button onClick={() => setStatus(OccupationStatus.want)} active={status === OccupationStatus.want}>
        想摸
      </Button>
      <Button onClick={() => setStatus(OccupationStatus.none)} active={status === OccupationStatus.none}>
        取消
      </Button>
    </ButtonGroup>
  );
};
