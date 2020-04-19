export function absent(wanted: string): never {
  throw new Error(`expected ${wanted}`);
}
