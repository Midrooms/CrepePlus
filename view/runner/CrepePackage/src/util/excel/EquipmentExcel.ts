import _EquipmentExcelTable from "../../data/excel/EquipmentExcelTable.json";
type EquipmentExcelTableEntry = typeof _EquipmentExcelTable[keyof typeof _EquipmentExcelTable]
const EquipmentExcelTable = _EquipmentExcelTable as { [key: string]: EquipmentExcelTableEntry };

export default class EquipmentExcel {
    private constructor() {
    }

    public static all() : EquipmentExcelTableEntry[] {
        return Object.values(EquipmentExcelTable);
    }

    public static fromId(id: number) : EquipmentExcelTableEntry {
        return EquipmentExcelTable[id];
    }

    public static fromIds(ids: number[]): EquipmentExcelTableEntry[] {
        return ids.map(id => EquipmentExcel.fromId(id));
    }
}