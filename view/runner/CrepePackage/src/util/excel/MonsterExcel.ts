import _MonsterExcelTable from "../../data/excel/MonsterExcelTable.json";
type MonsterExcelTableEntry = typeof _MonsterExcelTable[keyof typeof _MonsterExcelTable]
const MonsterExcelTable = _MonsterExcelTable as { [key: string]: MonsterExcelTableEntry };

export default class MonsterExcel {
    private constructor() {
    }

    public static all() : MonsterExcelTableEntry[] {
        return Object.values(MonsterExcelTable);
    }

    public static fromId(id: number) : MonsterExcelTableEntry {
        return MonsterExcelTable[id];
    }

    public static fromIds(ids: number[]): MonsterExcelTableEntry[] {
        return ids.map(id => MonsterExcel.fromId(id));
    }
}