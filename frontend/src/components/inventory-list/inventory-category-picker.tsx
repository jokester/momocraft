import React from 'react';
import { ItemsV3Json } from '../../items-db/json-schema';
import { RenderArray } from '../hoc/render-array';

export const InventoryCategoryPicker: React.FC<{
  sheets: ItemsV3Json.Sheet[];
  curentSheetId: number;
  setSheetId(sheetId: number): void;
}> = (props) => {
  return (
    <div className="sticky top-0 shadow p-2 px-4 bg-white z-10">
      物品种类: &nbsp;
      <select value={props.curentSheetId} onChange={(ev) => props.setSheetId(Number(ev.target.value))}>
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
