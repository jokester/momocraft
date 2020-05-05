import { Maps } from '@jokester/ts-commonutil/collection/maps';
import { ItemsV3Json } from './json-schema';
import { createLogger } from '../util/debug-logger';

const logger = createLogger(__filename);

function* iterateItems(root: ItemsV3Json.Root): Generator<ItemsV3Json.Item> {
  for (const s of root.sheets) {
    for (const i of s.items) yield i;
  }
}

export interface ItemsDatabaseV3 {
  readonly sheets: ItemsV3Json.Sheet[];
  readonly itemsMap: ReadonlyMap<string, ItemsV3Json.Item>;
}

export const dynamicItemsV2: () => Promise<ItemsDatabaseV3> = () =>
  import('./sheet01-schema03.json')
    .then((_: any) => {
      logger('dynamicLoaded', _);
      return _.default as ItemsV3Json.Root;
    })
    .then(_ => {
      const itemsMap = Maps.buildMap(iterateItems(_), _ => _.itemId);
      return {
        sheets: _.sheets,
        itemsMap,
      };
    });
