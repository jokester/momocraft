import { ItemsV2Json } from './json';
import { ItemColumnType } from '../model/item-id-def';

export const ItemUtils = {
  extractDisplayName(item: ItemsV2Json.Item): string {
    return [item.base[ItemColumnType.nameZhS]].filter(Boolean).join(' / ');
  },
} as const;
