export namespace ItemsV3Json {
  export interface Root {
    sheets: Sheet[];
  }

  export interface Sheet {
    sheetName: string;
    headers: string[];
    items: Item[];
  }

  export interface Item {
    itemId: string;
    base: Base;
    variants: Variant[];
  }

  export interface Base {
    改造类型A?: string;
    类型?: string;
    简体中文: string;
    繁体中文: string;
    日文: string;
    英文: string;
    订购类型?: string;
    细分类型?: string;
    尺寸?: string;
    改造类型B?: string;
    官方序号?: string;
    出现场所?: string;
    鱼影尺寸?: string;
    北半球出现季节?: string;
    南半球出现季节?: string;
    出现时间?: string;
    北半球月份?: string;
    南半球月份?: string;
    时间?: string;
    价格?: string;
    订购类型2?: string;
  }

  export interface Variant {
    颜色?: string;
    类型?: string;
    序号?: string;
  }
}
