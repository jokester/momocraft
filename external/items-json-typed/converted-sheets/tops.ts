// @generated
// @eslint-disable
import json from './tops.json';
export const topsSheet = json as any as ITopsRoot;
export type ITopsRoot = ITopsRootItem[];
interface ITopsRootItem {
    id: number;
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
