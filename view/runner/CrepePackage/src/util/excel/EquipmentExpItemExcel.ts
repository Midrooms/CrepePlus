import _EquipmentExpItemExcelTable from "../../data/excel/EquipmentExpItemExcelTable.json";
type EquipmentExpItemExcelTableEntry = typeof _EquipmentExpItemExcelTable[keyof typeof _EquipmentExpItemExcelTable]
const EquipmentExpItemExcelTable = _EquipmentExpItemExcelTable as { [key: string]: EquipmentExpItemExcelTableEntry };

export default class EquipmentExpItemExcel {
    private constructor() {
    }

    public static all() : EquipmentExpItemExcelTableEntry[] {
        return Object.values(EquipmentExpItemExcelTable);
    }

    public static fromId(id: number) : EquipmentExpItemExcelTableEntry {
        return EquipmentExpItemExcelTable[id];
    }

    public static fromIds(ids: number[]): EquipmentExpItemExcelTableEntry[] {
        return ids.map(id => EquipmentExpItemExcel.fromId(id));
    }
}