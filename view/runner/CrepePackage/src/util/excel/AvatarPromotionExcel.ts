import _AvatarPromotionExcelTable from "../../data/excel/AvatarPromotionExcelTable.json";
type AvatarPromotionExcelTableEntry = typeof _AvatarPromotionExcelTable[keyof typeof _AvatarPromotionExcelTable]
const AvatarPromotionExcelTable = _AvatarPromotionExcelTable as { [key: string]: AvatarPromotionExcelTableEntry };

export default class AvatarPromotionExcel {
    private constructor() {
    }

    public static all() : AvatarPromotionExcelTableEntry[] {
        return Object.values(AvatarPromotionExcelTable);
    }

    public static fromId(id: string) : AvatarPromotionExcelTableEntry {
        return AvatarPromotionExcelTable[id];
    }

    public static fromIds(ids: string[]): AvatarPromotionExcelTableEntry[] {
        return ids.map(id => AvatarPromotionExcel.fromId(id));
    }
}