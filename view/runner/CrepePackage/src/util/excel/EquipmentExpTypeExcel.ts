import _EquipmentExpTypeExcelTable from "../../data/excel/EquipmentExpTypeExcelTable.json";
type EquipmentExpTypeExcelTableEntry = typeof _EquipmentExpTypeExcelTable[keyof typeof _EquipmentExpTypeExcelTable]
const EquipmentExpTypeExcelTable = _EquipmentExpTypeExcelTable as { [key: string]: EquipmentExpTypeExcelTableEntry };

export default class EquipmentExpTypeExcel {
    private constructor() {
    }

    public static all() : EquipmentExpTypeExcelTableEntry[] {
        return Object.values(EquipmentExpTypeExcelTable);
    }

    public static fromId(id: string) : EquipmentExpTypeExcelTableEntry {
        return EquipmentExpTypeExcelTable[id];
    }

    public static fromIds(ids: string[]): EquipmentExpTypeExcelTableEntry[] {
        return ids.map(id => EquipmentExpTypeExcel.fromId(id));
    }
}