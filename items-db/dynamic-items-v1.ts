import { Maps } from '@jokester/ts-commonutil/collection/maps';
import { ItemsV2Json } from './json-schema';
import { createLogger } from '../util/debug-logger';

const logger = createLogger(__filename);

function* iterateItems(root: ItemsV2Json.Root): Generator<ItemsV2Json.Item> {
  for (const s of root.sheets) {
    for (const i of s.items) yield i;
  }
}

export const dynamicItemsV2 = () =>
  import('./sheet1-schema2.json')
    .then((_: any) => {
      logger('dynamicLoaded', _);
      return _.default as ItemsV2Json.Root;
    })
    .then(_ => {
      const itemsMap = Maps.buildMap(iterateItems(_), _ => _.itemName);
      return {
        sheets: _.sheets,
        itemsMap,
      };
    });
