import debug from 'debug';
import { isDevBuild } from '../config/build-env';

const pathSegments = __dirname.split(/[/\\]/);

/**
 * TODO: port
 * @param {string} rootDir
 * @param prefix
 * @param {boolean} stripCodeExt
 * @returns {(srcFile: string, appendee?: string) => string}
 */
const getDebugNamespace = (rootDir: string, prefix: string, stripCodeExt = true) => (
  srcFile: string,
  appendee?: string,
) => {
  const namespace = srcFile.startsWith(rootDir)
    ? srcFile
        .slice(rootDir.length, srcFile.length)
        .replace(/^\//, '')
        .replace(/\//g, ':')
    : srcFile.replace(/^\//, '').replace(/\//g, ':');

  const striped = stripCodeExt ? namespace.replace(/\.(ts|js)x?$/i, '') : namespace;

  const suffixed = appendee ? `${striped}:${appendee}` : striped;
  return prefix ? `${prefix}:` + suffixed : suffixed;
};

const ns = getDebugNamespace(pathSegments.slice(0, pathSegments.length - 2).join('/'), 'momocraft');

export function createLogger(srcFile: string, attachTapper = isDevBuild) {
  const debugLogger = debug(ns(srcFile));

  const withTapper = {
    tap: attachTapper
      ? <A>(value: A): typeof value => {
          debugLogger('tap', value);
          return value;
        }
      : emptyTapper,
  };

  Object.assign(debugLogger, withTapper);

  return debugLogger as typeof debugLogger & typeof withTapper;
}

const emptyTapper = <A>(value: A) => value;
