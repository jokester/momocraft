// @generated
// @eslint-disable
import json from './variants.json';
export const variantsSheet = json as any as IVariantsRoot;
export type IVariantsRoot = IVariantsRootItem[];
interface IVariantsRootItem {
    id: string;
    variant_id: string;
    furniture_name: string;
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
