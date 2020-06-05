// @generated
// @eslint-disable
import json from './bags.json';
export const bagsSheet = json as any as IBagsRoot;
export type IBagsRoot = IBagsRootItem[];
interface IBagsRootItem {
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
