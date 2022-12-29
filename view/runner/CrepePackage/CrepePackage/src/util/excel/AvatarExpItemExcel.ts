import _AvatarExpItemConfigExcelTable from "../../data/excel/AvatarExpItemConfigExcelTable.json";
type AvatarExpItemConfigExcelTableEntry = typeof _AvatarExpItemConfigExcelTable[keyof typeof _AvatarExpItemConfigExcelTable]
const AvatarExpItemConfigExcelTable = _AvatarExpItemConfigExcelTable as { [key: string]: AvatarExpItemConfigExcelTableEntry };

export default class AvatarExpItemExcel {
    private constructor() {
    }

    public static all() : AvatarExpItemConfigExcelTableEntry[] {
        return Object.values(AvatarExpItemConfigExcelTable);
    }

    public static fromId(id: number) : AvatarExpItemConfigExcelTableEntry {
        return AvatarExpItemConfigExcelTable[id];
    }

    public static fromIds(ids: number[]): AvatarExpItemConfigExcelTableEntry[] {
        return ids.map(id => AvatarExpItemExcel.fromId(id));
    }
}