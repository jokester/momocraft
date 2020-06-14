import path from 'path';
import debug from 'debug';
import { getDebugNamespace } from '@jokester/ts-commonutil/cjs/logging/get-debug-namespace';

const createNamespace = getDebugNamespace(path.join(__dirname, '..'));
export function getDebugLogger(srcFile: string): debug.IDebugger {
  const namespace = 'hanko:' + createNamespace(srcFile);
  return debug(namespace);
}
