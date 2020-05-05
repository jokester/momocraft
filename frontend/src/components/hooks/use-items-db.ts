import { itemsDatabaseV3 } from '../../items-db/dynamic-load-db';
import { usePromised } from '@jokester/ts-commonutil/react/hook/use-promised';

export function useItemsDB() {
  return usePromised(itemsDatabaseV3);
}
