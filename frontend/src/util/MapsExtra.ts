function fromArray<T, K>(items: readonly T[], createKey: (t: T) => K): Map<K, T> {
  const ret = new Map<K, T>();
  items.forEach(i => ret.set(createKey(i), i));
  return ret;
}

export const MapsExtra = {
  fromArray,
} as const;
