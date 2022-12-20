import _ExpTypeExcelTable from "../../data/excel/ExpTypeExcelTable.json";
type ExpTypeExcelTableEntry = typeof _ExpTypeExcelTable[keyof typeof _ExpTypeExcelTable]
const ExpTypeExcelTable = _ExpTypeExcelTable as { [key: string]: ExpTypeExcelTableEntry };

export default class ExpTypeExcel {
    private constructor() {
    }

    public static all() : ExpTypeExcelTableEntry[] {
        return Object.values(ExpTypeExcelTable);
    }

    public static fromId(id: string) : ExpTypeExcelTableEntry {
        return ExpTypeExcelTable[id];
    }

    public static fromIds(ids: string[]): ExpTypeExcelTableEntry[] {
        return ids.map(id => ExpTypeExcel.fromId(id));
    }
}