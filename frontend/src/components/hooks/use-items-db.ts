import { itemsDatabaseV3 } from '../../items-db/dynamic-load-db';
import { usePromised } from '@jokester/ts-commonutil/lib/react/hook/use-promised';

export function useItemsDB() {
  return usePromised(itemsDatabaseV3);
}
