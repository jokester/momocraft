// @generated
// @eslint-disable
import json from './socks.json';
export const socksSheet = json as any as ISocksRoot;
export type ISocksRoot = ISocksRootItem[];
interface ISocksRootItem {
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
