import { inServer } from '../config/build-env';

interface TypedLocalStorage<PersistenceMap> {
  getItem<K extends keyof PersistenceMap>(key: K): null | PersistenceMap[K];

  setItem<K extends keyof PersistenceMap>(key: K, value: PersistenceMap[K]): void;
  removeItem(key: keyof PersistenceMap): void;

  // NO clear
}

const browserImpl = {
  getItem(key: string) {
    try {
      return JSON.parse(localStorage.getItem(key)!);
    } catch (ignored) {
      return null;
    }
  },
  setItem(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem(key: string): void {
    localStorage.removeItem(key);
  },
} as const;

const ssrImpl = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
} as const;

export function useTypedLocalStorage<M extends Record<string, {}>>(): TypedLocalStorage<M> {
  return inServer ? ssrImpl : (browserImpl as any);
}
