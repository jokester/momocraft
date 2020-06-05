// @generated
// @eslint-disable
import json from './villagers.json';
export const villagersSheet = json as any as IVillagersRoot;
export type IVillagersRoot = IVillagersRootItem[];
interface IVillagersRootItem {
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
