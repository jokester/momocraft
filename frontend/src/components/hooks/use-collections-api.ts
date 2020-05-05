import { useSingletons } from '../../internal/app-context';
import { useMemo } from 'react';
import { CollectionState, ItemCollectionEntry } from '../../model/collection';
import { Maps } from '@jokester/ts-commonutil/collection/maps';
import { fold, map, right } from 'fp-ts/lib/Either';
import { useConcurrencyControl } from '../generic-hooks/use-concurrency-control';
import { useDependingState } from '../generic-hooks/use-depending-state';
import { itemsDatabaseV3, ItemsDatabaseV3 } from '../../items-db/dynamic-load-db';

const builder = {
  buildCollectionMap: (itemsDb: ItemsDatabaseV3, f: ItemCollectionEntry[]) => {
    const want = f.filter(_ => _.state === CollectionState.want && itemsDb.itemsMap.has(_.itemId));

    const owns = f.filter(_ => _.state === CollectionState.own && itemsDb.itemsMap.has(_.itemId));

    return {
      itemsMap: itemsDb.itemsMap,
      collectionsMap: Maps.buildMap(f, _ => _.itemId),
      want,
      owns,
    } as const;
  },
} as const;

export function useCollectionList(userId: null | string) {
  const singletons = useSingletons();

  const fetched = useMemo(async () => {
    if (userId) {
      const [itemsDb, fetched] = await Promise.all([itemsDatabaseV3, singletons.collection.fetchCollections(userId)]);

      return map((f: ItemCollectionEntry[]) => builder.buildCollectionMap(itemsDb, f))(fetched);
    } else {
      const itemsDb = await itemsDatabaseV3;

      return map((f: ItemCollectionEntry[]) => builder.buildCollectionMap(itemsDb, f))(right([]));
    }
  }, [singletons, userId]);
  return fetched;
}

export type CollectionStateMap = ReturnType<typeof builder.buildCollectionMap>;

export function useCollectionApi(itemId: string, initialMap: null | CollectionStateMap) {
  const singletons = useSingletons();

  const serverState = useMemo(() => initialMap?.collectionsMap?.get(itemId)?.state || CollectionState.none, [
    itemId,
    initialMap,
  ]);

  const [localState, setLocalState] = useDependingState<null | CollectionState>(() => null, [serverState]);

  const [withLock, concurrency] = useConcurrencyControl(1);

  const api = useMemo(() => {
    return {
      setState: (newState: CollectionState) => {
        withLock(async mounted => {
          const x = await singletons.collection.saveCollections([{ itemId: itemId, state: newState }]);

          fold(
            (l: string) => {
              singletons.toaster.current.show({ intent: 'warning', message: `保存失败: ${l}` });
            },
            (r: ItemCollectionEntry[]) => {
              mounted.current && setLocalState(newState);
              singletons.toaster.current.show({ intent: 'success', message: `保存成功`, timeout: 1e3 });
            },
          )(x);
        });
      },
    } as const;
  }, [itemId, singletons]);

  return [localState || serverState, api, concurrency > 0] as const;
}
