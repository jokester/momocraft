import debug from 'debug';

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

export function createLogger(srcFile: string) {
  return debug(ns(srcFile));
}
