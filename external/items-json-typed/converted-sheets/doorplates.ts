// @generated
// @eslint-disable
import json from './doorplates.json';
export const doorplatesSheet = json as any as IDoorplatesRoot;
export type IDoorplatesRoot = IDoorplatesRootItem[];
interface IDoorplatesRootItem {
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
