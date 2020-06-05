import { Maps } from '@jokester/ts-commonutil/collection/maps';
import { ItemsV3Json } from './json-schema';
import { createLogger } from '../util/debug-logger';
import { inServer } from '../const/build-env';
import { Never } from '@jokester/ts-commonutil/concurrency/timing';

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

export const itemsDatabaseV3: Promise<ItemsDatabaseV3> = inServer ? Never : dynamicItemsV3();

async function dynamicItemsV3(): Promise<ItemsDatabaseV3> {
  if (inServer) return null!;

  const root: ItemsV3Json.Root = await fetch('/items-db/2dad1b2b5988ad4dfbcbc99d08b6ed1e.json').then((_) => _.json());
  const itemsMap = Maps.buildMap(iterateItems(root), (_) => _.itemId);

  return {
    sheets: root.sheets,
    itemsMap,
  };
}
