import { Maps } from '@jokester/ts-commonutil/collection/maps';
import { ItemsV2Json } from './json';

function* iterateItems(root: ItemsV2Json.Root): Generator<ItemsV2Json.Item> {
  for (const s of root.sheets) {
    for (const i of s.items) yield i;
  }
}

export const dynamicItemsV2 = () =>
  import('./json')
    .then(_ => _.itemsV2.default)
    .then(_ => {
      const itemsMap = Maps.buildMap(iterateItems(_), _ => _.itemName);
      return {
        sheets: _.sheets,
        itemsMap,
      };
    });
