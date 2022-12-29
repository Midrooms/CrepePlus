import _ShopGoodsConfigExcelTable from "../../data/excel/ShopGoodsConfigExcelTable.json";
const ShopGoodsConfigExcelTable = _ShopGoodsConfigExcelTable as { [key: string]: ShopGoodsConfigExcelTableEntry };

export default class ShopGoodsConfigExcel {
    private constructor() {
    }

    public static fromId(id: number) : ShopGoodsConfigExcelTableEntry {
        return ShopGoodsConfigExcelTable[id];
    }

    public static fromIds(ids: number[]): ShopGoodsConfigExcelTableEntry[] {
        return ids.map(id => ShopGoodsConfigExcel.fromId(id));
    }

    public static fromShopId(id: number): ShopGoodsConfigExcelTableEntry[] {
        return Object.values(ShopGoodsConfigExcelTable).filter(entry => entry.ShopID == id);
    }
}

interface TextMap {
    hash: number;
}

export interface ShopGoodsConfigExcelTableEntry {
    GoodsID: number,
    ItemID: number,
    ShopGoodsIconPath: string,
    ItemCount: number,
    Level: number,
    Rank: number,
    CurrencyList: number[],
    CurrencyCostList: number[],
    GoodsSortID: number,
    LimitType1: string,
    LimitValue1List: number[],
    LimitType2: string,
    LimitValue2List: number[],
    OnShelfType1: string,
    OnShelfValue1List: number[],
    LimitTimes: number,
    CanBeRefresh: boolean,
    RefreshType: number,
    ShopID: number,
    ScheduleDataID: number
}