export function absent(expected: string): never {
  throw new Error(`expected ${expected}`);
}
