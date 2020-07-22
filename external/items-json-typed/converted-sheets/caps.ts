// @generated
// @eslint-disable
import json from './caps.json';
export const capsSheet = json as any as ICapsRoot;
export type ICapsRoot = ICapsRootItem[];
interface ICapsRootItem {
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
