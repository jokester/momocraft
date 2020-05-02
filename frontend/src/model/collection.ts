export const enum CollectionState {
  want = 'want',
  own = 'own',
  none = 'none',

  // internal
  unknown = 'unknown',

  // unset = 'unset', (just use null)
}

export interface ItemCollectionEntry {
  itemId: string;
  state: CollectionState;
}
