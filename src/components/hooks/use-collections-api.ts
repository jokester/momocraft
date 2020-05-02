import { useSingletons } from '../../internal/app-context';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CollectionItem, CollectionState } from '../../model/collection';
import { Maps } from '@jokester/ts-commonutil/collection/maps';
import { isRight, map } from 'fp-ts/lib/Either';
import { useConcurrencyControl } from '../generic-hooks/use-concurrency-control';

const builder = {
  buildCollectionMap: (fetched: CollectionItem[]) => ({
    raw: fetched,
    map: Maps.buildMap(fetched, item => item.itemId),
  }),
} as const;

const mapper = {
  buildCollectionMapEither: map(builder.buildCollectionMap),
} as const;

export function useFetchedCollections() {
  const singletons = useSingletons();

  return useMemo(() => singletons.collection.fetchCollections().then(mapper.buildCollectionMapEither), [singletons]);
}

function initialCollectionState(
  itemName: string,
  initial: ReturnType<typeof builder.buildCollectionMap>,
): CollectionState {
  return initial.map.get(itemName)?.state || CollectionState.none;
}

export function useCollectionApi(itemName: string, initial: ReturnType<typeof builder.buildCollectionMap>) {
  const singletons = useSingletons();
  const [serverState, setServerState] = useMemo(() => initialCollectionState(itemName, initial), [itemName, initial]);

  const [localState, setLocalState] = useDependingState<null | CollectionState>(() => null, [serverState]);

  const [withLock, concurrency] = useConcurrencyControl(1);

  const api = useCallback(() => {
    return {
      setState: (newState: CollectionState) => {
        withLock(async m => {
          const x = await singletons.collection.saveCollections([{ itemId: itemName, state: newState }]);
          if (isRight(x)) {
            if (m.current) setLocalState(newState);
          } else {
            alert(x.left);
          }
        });
      },
    } as const;
  }, [itemName, initial, singletons]);

  return [localState || serverState, api, concurrency > 0] as const;
}

function useDependingState<T, F extends (...args: any) => any = (...args: any) => any>(
  initialize: F,
  deps: Parameters<F>,
) {
  const isFirstRun = useRef(false);
  const [state, setState] = useState(() => initialize.call(null, deps));
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
    } else {
      setState(initialize.call(null, deps));
    }
  }, deps);
  return [state, setState] as const;
}
