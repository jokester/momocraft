// @generated
// @eslint-disable
import json from './rugs.json';
export const rugsSheet = json as any as IRugsRoot;
export type IRugsRoot = IRugsRootItem[];
interface IRugsRootItem {
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
