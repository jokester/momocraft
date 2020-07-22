// @generated
// @eslint-disable
import json from './fossils.json';
export const fossilsSheet = json as any as IFossilsRoot;
export type IFossilsRoot = IFossilsRootItem[];
interface IFossilsRootItem {
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
