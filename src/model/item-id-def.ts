export function itemIdDef(sheetIndex: number, itemIndexInSheet: number) {
  return `mo-${sheetIndex}-${itemIndexInSheet}`;
}

export function itemIdExtract(itemIdEncoded: string): null | { sheetIndex: number; itemIndexInSheet: number } {
  let x;
  if ((x = /^mo-(\d+)-(\d+)$/i.exec(itemIdEncoded))) {
    const [_, sheetIndex, itemIndexInSheet] = x;
    return { sheetIndex: parseInt(sheetIndex), itemIndexInSheet: parseInt(itemIndexInSheet) };
  }
  return null;
}

export const enum ItemColumnType {
  // name
  nameZhS = '简体中文',
  nameZhT = '繁体中文',
  nameJa = '日文',
  nameEn = '英文',
  // variants?
  customizationA = '改造类型A',
  customizationB = '改造类型B',
  // color = '颜色',
  // meta?
  type = '类型',
  orderType = '订购类型',
  orderType2 = '订购类型2',
  detailType = '细分类型',
  size = '尺寸',
  // '出现场所',
  // '鱼影尺寸',
  // '北半球出现季节',
  // '南半球出现季节',
  // '出现时间',
  // '北半球月份',
  // '南半球月份',
  // '时间',
  // '价格',
  // id?
  officialItemId = '官方序号',
  itemId = '序号',
}

export const enum VariantColumnType {
  color = '颜色',
  type = '类型',
  itemId = '序号',
}
