import _ShopConfigExcelTable from "../../data/excel/ShopConfigExcelTable.json";
const ShopConfigExcelTable = _ShopConfigExcelTable as { [key: string]: ShopConfigExcelTableEntry };

export default class ShopConfigExcel {
    private constructor() {
    }

    public static all() : ShopConfigExcelTableEntry[] {
        return Object.values(ShopConfigExcelTable);
    }

    public static fromId(id: number) : ShopConfigExcelTableEntry {
        return ShopConfigExcelTable[id];
    }

    public static fromIds(ids: number[]): ShopConfigExcelTableEntry[] {
        return ids.map(id => ShopConfigExcel.fromId(id));
    }
}

interface TextMap {
    hash: number;
}

export interface ShopConfigExcelTableEntry {
    ShopID: number,
    ShopMainType: string,
    ShopType: number,
    ShopName: TextMap,
    ShopDesc: TextMap,
    ShopIconPath: string,
    LimitType1: string,
    LimitValue1List: number[],
    LimitType2: string,
    LimitValue2List: number[],
    IsOpen: boolean,
    ServerVerification: boolean,
    ScheduleDataID: number
}