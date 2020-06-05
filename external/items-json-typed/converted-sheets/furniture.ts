// @generated
// @eslint-disable
import json from './furniture.json';
export const furnitureSheet = json as any as IFurnitureRoot;
export type IFurnitureRoot = IFurnitureRootItem[];
interface IFurnitureRootItem {
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
