import { useSingletons } from '../../internal/app-context';
import { useMemo } from 'react';
import { CollectionState } from '../../const-shared/collection';
import { Maps } from '@jokester/ts-commonutil/lib/collection/maps';
import { fold, map, right } from 'fp-ts/lib/Either';
import { useConcurrencyControl } from '@jokester/ts-commonutil/lib/react/hook/use-concurrency-control';
import { useDependingState } from '@jokester/ts-commonutil/lib/react/hook/use-depending-state';
import { itemsDatabaseV3, ItemsDatabaseV3 } from '../../items-db/dynamic-load-db';
import { ItemCollectionDto } from '../../services/api-generated/models';
import { ApiError } from '../../services/api/api-convention';

const builder = {
  buildCollectionMap: (itemsDb: ItemsDatabaseV3, userId: null | string, f: ItemCollectionDto[]) => {
    const want = f.filter((_) => _.state === CollectionState.want && itemsDb.itemsMap.has(_.itemId));

    const owns = f.filter((_) => _.state === CollectionState.own && itemsDb.itemsMap.has(_.itemId));

    return {
      userId,
      itemsMap: itemsDb.itemsMap,
      collectionsMap: Maps.buildMap(f, (_) => _.itemId),
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

      return map((f: ItemCollectionDto[]) => builder.buildCollectionMap(itemsDb, userId, f))(fetched);
    } else {
      const itemsDb = await itemsDatabaseV3;

      return map((f: ItemCollectionDto[]) => builder.buildCollectionMap(itemsDb, userId, f))(right([]));
    }
  }, [singletons, userId]);
  return fetched;
}

export type CollectionStateMap = ReturnType<typeof builder.buildCollectionMap>;

export function useCollectionApi(itemId: string, initialMap: null | CollectionStateMap) {
  const singletons = useSingletons();

  const serverState = useMemo(
    () => initialMap?.collectionsMap?.get(itemId)?.state || CollectionState.none,
    [itemId, initialMap],
  );

  const [localState, setLocalState] = useDependingState<null | CollectionState>(() => null, [serverState]);

  const [withLock, concurrency] = useConcurrencyControl(1);

  const api = useMemo(() => {
    return {
      setState: (newState: CollectionState) => {
        withLock(async (mounted) => {
          const x = await singletons.collection.saveCollections([{ itemId: itemId, state: newState }]);

          fold(
            (l: ApiError) => {
              singletons.toast({ status: 'warning', title: `保存失败: ${l}` });
            },
            (r: ItemCollectionDto[]) => {
              mounted.current && setLocalState(newState);
              singletons.toast({ status: 'success', title: `保存成功`, duration: 1e3 });
            },
          )(x);
        });
      },
    } as const;
  }, [itemId, singletons]);

  return [localState || serverState, api, concurrency > 0] as const;
}
