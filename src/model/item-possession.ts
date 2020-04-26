export const enum PossessionState {
  with = 'with',
  own = 'own',
  none = 'none',
}

export interface ItemPossession {
  itemId: string;
  state: PossessionState;
}

export function randomPossessionState() {
  const m = Math.random();
  if (m < 0.1) return PossessionState.own;
  else if (m < 0.3) return PossessionState.with;
  else return PossessionState.none;
}
