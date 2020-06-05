const fs = require('fs');
const util = require('util');
const fsp = require("@jokester/ts-commonutil/cjs/node/fsp")
const { json2ts } = require('json-ts');
const crypto = require('crypto');

function md5(str) {
  return crypto.createHash('md5').update(str).digest("hex");
}

function keyedToArray(keyedObject) {
  return Object.keys(keyedObject).map(origKey => ({ origKey, ...keyedObject[origKey] }))
}

const JSON_INDENT = 0;

const JSON_SRC = `${__dirname}/../translation-sheet-data/`;
const CONVERTED_SHEETS = `${__dirname}/converted-sheets/`;
const JSON_HASHED = `${__dirname}/json-hashed/`;

async function main() {

  const maybeJson = await fsp.readDir(JSON_SRC);

  console.debug('maybeJson', JSON_SRC, maybeJson);

  const fns = new Map(/* fn => md5 */);

  for (const basename of maybeJson) {
    const [_, fn] = /^(.*)?\.json$/i.exec(basename) || [];

    if (fn) {
      const translatedSheet = JSON.parse(await fsp.readText(`${JSON_SRC}/${fn}.json`));

      const cameledFn = fn.replace(/^\w/, _ => _.toUpperCase());

      const tsDecl = json2ts(JSON.stringify(translatedSheet), { rootName: `${cameledFn}Root` });

      const header = `
// @generated
// @eslint-disable
import json from './${fn}.json';
export const ${fn}Sheet = json as any as I${cameledFn}Root;
export `.trimLeft();

      const sheetJsonContent = JSON.stringify(translatedSheet, null, JSON_INDENT);

      const hash = md5(sheetJsonContent);
      await fsp.writeFile(`${CONVERTED_SHEETS}/${fn}.ts`, header + tsDecl);
      await fsp.writeFile(`${CONVERTED_SHEETS}/${fn}.json`, sheetJsonContent);
      await fsp.writeFile(`${JSON_HASHED}/_${hash}.json`, sheetJsonContent);

      fns.set(fn, hash)
    }
  }

  await fsp.writeFile(`${CONVERTED_SHEETS}/item-sheets.ts`,
    `
// @generated
// @eslint-disable
export const enum ItemSheetNames {
${Array.from(fns).map(([fn, md5]) => `  ${fn} = '${fn}',`).join("\n")}
}

export const enum ItemSheetManifests {
  ${Array.from(fns).map(([fn, md5]) => `  ${fn} = '_${md5}',`).join("\n")}
}
`
  );
}

main();
