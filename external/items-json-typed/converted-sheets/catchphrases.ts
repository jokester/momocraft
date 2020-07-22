// @generated
// @eslint-disable
import json from './catchphrases.json';
export const catchphrasesSheet = json as any as ICatchphrasesRoot;
export type ICatchphrasesRoot = ICatchphrasesRootItem[];
interface ICatchphrasesRootItem {
    id: string;
    version: string;
    locale: ILocale;
}
interface ILocale {
    USen: string;
    EUen: string;
    EUde: string;
    EUes: string;
    USes: string;
    EUfr: string;
    USfr: string;
    EUit: string;
    EUnl: string;
    CNzh: string;
    TWzh: string;
    JPja: string;
    KRko: string;
    EUru: string;
}
