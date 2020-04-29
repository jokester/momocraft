import { useMemo } from 'react';
import { dynamicItemsV1 } from '../../json/dynamic-items-v1';
import { usePromised } from '@jokester/ts-commonutil/react/hook/use-promised';

export function useItemsDB() {
  const itemsDbP = useMemo(dynamicItemsV1, []);
  return usePromised(itemsDbP);
}
