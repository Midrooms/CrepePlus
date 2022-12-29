import _MapEntryExcelTable from "../../data/excel/MapEntryExcelTable.json";
type MapEntryExcelTableEntry = typeof _MapEntryExcelTable[keyof typeof _MapEntryExcelTable]
const MapEntryExcelTable = _MapEntryExcelTable as { [key: string]: MapEntryExcelTableEntry };

export default class MapEntryExcel {
    private constructor() {
    }

    public static all() : MapEntryExcelTableEntry[] {
        return Object.values(MapEntryExcelTable);
    }

    public static fromId(id: number) : MapEntryExcelTableEntry {
        return MapEntryExcelTable[id];
    }

    public static fromIds(ids: number[]): MapEntryExcelTableEntry[] {
        return ids.map(id => MapEntryExcel.fromId(id));
    }

    public static fromFloorId(id: number) : MapEntryExcelTableEntry {
        return Object.values(MapEntryExcelTable).filter(e => e.FloorID == id)?.[0];
    }
}