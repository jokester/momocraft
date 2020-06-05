import { ItemsV3Json } from './json-schema';
import { ItemColumnType } from '../model/item-id-def';

export const ItemUtils = {
  extractDisplayName(item: ItemsV3Json.Item): string {
    return [item.base[ItemColumnType.nameZhS]].filter(Boolean).join(' / ');
  },
} as const;
