export const enum CollectionState {
  with = 'with',
  own = 'own',
  none = 'none',

  // internal
  unknown = 'unknown',

  // unset = 'unset', (just use null)
}

export interface CollectionItem {
  itemId: string;
  state: CollectionState;
}

export function randomCollectionState() {
  const m = Math.random();
  if (m < 0.1) return CollectionState.own;
  else if (m < 0.3) return CollectionState.with;
  else return CollectionState.none;
}
