import _EquipmentPromotionExcelTable from "../../data/excel/EquipmentPromotionExcelTable.json";
type EquipmentPromotionExcelTableEntry = typeof _EquipmentPromotionExcelTable[keyof typeof _EquipmentPromotionExcelTable]
const EquipmentPromotionExcelTable = _EquipmentPromotionExcelTable as { [key: string]: EquipmentPromotionExcelTableEntry };

export default class EquipmentPromotionExcel {
    private constructor() {
    }

    public static all() : EquipmentPromotionExcelTableEntry[] {
        return Object.values(EquipmentPromotionExcelTable);
    }

    public static fromId(id: string) : EquipmentPromotionExcelTableEntry {
        return EquipmentPromotionExcelTable[id];
    }

    public static fromIds(ids: string[]): EquipmentPromotionExcelTableEntry[] {
        return ids.map(id => EquipmentPromotionExcel.fromId(id));
    }
}