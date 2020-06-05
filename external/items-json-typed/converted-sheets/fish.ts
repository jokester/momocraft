// @generated
// @eslint-disable
import json from './fish.json';
export const fishSheet = json as any as IFishRoot;
export type IFishRoot = IFishRootItem[];
interface IFishRootItem {
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
