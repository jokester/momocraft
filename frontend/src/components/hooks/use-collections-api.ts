import { useSingletons } from '../../internal/app-context';
import { useMemo } from 'react';
import { CollectionItem, CollectionState } from '../../model/collection';
import { Maps } from '@jokester/ts-commonutil/collection/maps';
import { fold, isRight, map } from 'fp-ts/lib/Either';
import { useConcurrencyControl } from '../generic-hooks/use-concurrency-control';
import { usePromised } from '@jokester/ts-commonutil/react/hook/use-promised';
import { useDependingState } from '../generic-hooks/use-depending-state';
import { useMounted } from '../generic-hooks/use-mounted';

const builder = {
  buildCollectionMap: (fetched: CollectionItem[]) => ({
    raw: fetched,
    map: Maps.buildMap(fetched, item => item.itemId),
  }),
} as const;

const mapper = {
  buildCollectionMapEither: map(builder.buildCollectionMap),
  foldCollectionRes: fold(l => null, builder.buildCollectionMap),
} as const;

export function useFetchedCollections() {
  const singletons = useSingletons();

  const fetched = useMemo(() => singletons.collection.fetchCollections().then(mapper.foldCollectionRes), [singletons]);
  return usePromised(fetched);
}

function initialCollectionState(
  itemName: string,
  initial: ReturnType<typeof builder.buildCollectionMap>,
): CollectionState {
  return initial.map.get(itemName)?.state || CollectionState.none;
}

export type CollectionStateMap = ReturnType<typeof builder.buildCollectionMap>;

export function useCollectionApi(itemName: string, initialMap: null | CollectionStateMap) {
  const singletons = useSingletons();

  const serverState = useMemo(() => initialMap?.map.get(itemName)?.state || CollectionState.none, [
    itemName,
    initialMap,
  ]);

  const [localState, setLocalState] = useDependingState<null | CollectionState>(() => null, [serverState]);

  const [withLock, concurrency] = useConcurrencyControl(1);

  const api = useMemo(() => {
    return {
      setState: (newState: CollectionState) => {
        withLock(async mounted => {
          const x = await singletons.collection.saveCollections([{ itemId: itemName, state: newState }]);

          fold(
            (l: string) => {
              singletons.toaster.current.show({ intent: 'warning', message: `保存失败: ${l}` });
            },
            (r: CollectionItem[]) => {
              mounted.current && setLocalState(newState);
              singletons.toaster.current.show({ intent: 'success', message: `保存成功`, timeout: 1e3 });
            },
          )(x);
        });
      },
    } as const;
  }, [itemName, singletons]);

  return [localState || serverState, api, concurrency > 0] as const;
}
