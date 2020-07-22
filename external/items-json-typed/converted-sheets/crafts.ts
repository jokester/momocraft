// @generated
// @eslint-disable
import json from './crafts.json';
export const craftsSheet = json as any as ICraftsRoot;
export type ICraftsRoot = ICraftsRootItem[];
interface ICraftsRootItem {
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
