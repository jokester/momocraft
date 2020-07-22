// @generated
// @eslint-disable
import json from './constellations.json';
export const constellationsSheet = json as any as IConstellationsRoot;
export type IConstellationsRoot = IConstellationsRootItem[];
interface IConstellationsRootItem {
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
