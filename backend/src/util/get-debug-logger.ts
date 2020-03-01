import path from 'path';
import debug from 'debug';

export function getDebugLogger(srcFile: string): debug.IDebugger {
  const relativeToSrc = path.relative(path.join(__dirname, '..'), srcFile),
    namespace = 'hanko:' + relativeToSrc.replace(path.sep, ':').replace(/\.(js|ts)x?$/i, '');
  return debug(namespace);
}
