// @generated
// @eslint-disable
import json from './eventitems.json';
export const eventitemsSheet = json as any as IEventitemsRoot;
export type IEventitemsRoot = IEventitemsRootItem[];
interface IEventitemsRootItem {
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
    EUru?: string;
}
