import { useMemo } from 'react';
import { dynamicItemsV2 } from '../../items-db/dynamic-load-db';
import { usePromised } from '@jokester/ts-commonutil/react/hook/use-promised';

export function useItemsDB() {
  const itemsDbP = useMemo(dynamicItemsV2, []);
  return usePromised(itemsDbP);
}
