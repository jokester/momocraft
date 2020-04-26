export const enum OccupationStatus {
  want = 'want',
  own = 'own',
  none = 'none',
}

export function rollOccupationStatus() {
  const m = Math.random();
  if (m < 0.1) return OccupationStatus.own;
  else if (m < 0.3) return OccupationStatus.want;
  else return OccupationStatus.none;
}
