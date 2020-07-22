// @generated
// @eslint-disable
import json from './patterns.json';
export const patternsSheet = json as any as IPatternsRoot;
export type IPatternsRoot = IPatternsRootItem[];
interface IPatternsRootItem {
    id: string;
    variant_id: string;
    furniture_name: string;
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
