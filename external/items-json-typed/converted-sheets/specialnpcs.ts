// @generated
// @eslint-disable
import json from './specialnpcs.json';
export const specialnpcsSheet = json as any as ISpecialnpcsRoot;
export type ISpecialnpcsRoot = ISpecialnpcsRootItem[];
interface ISpecialnpcsRootItem {
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
