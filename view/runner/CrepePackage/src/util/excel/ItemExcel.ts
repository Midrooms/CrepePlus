import _ItemExcelTable from "../../data/excel/ItemExcelTable.json";
type ItemExcelTableEntry = typeof _ItemExcelTable[keyof typeof _ItemExcelTable]
const ItemExcelTable = _ItemExcelTable as { [key: string]: ItemExcelTableEntry };

export default class ItemExcel {
    private constructor() {
    }

    public static all() : ItemExcelTableEntry[] {
        return Object.values(ItemExcelTable);
    }

    public static fromId(id: number) : ItemExcelTableEntry {
        return ItemExcelTable[id];
    }

    public static fromIds(ids: number[]): ItemExcelTableEntry[] {
        return ids.map(id => ItemExcel.fromId(id));
    }
}