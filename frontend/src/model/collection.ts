export const enum CollectionState {
  want = 'want',
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
