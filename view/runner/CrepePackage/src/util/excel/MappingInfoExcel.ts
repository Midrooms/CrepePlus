import _MappingInfoExcelTable from "../../data/excel/MappingInfoExcelTable.json";

interface TextMap {
    hash: number;
}

interface MappingInfoExcelEntry {
    ID: number;
    WorldLevel: number;
    Type: "TYPE_COCOON" | "TYPE_TOWN";
    IsTeleport: boolean;
    IsShowInFog: boolean;
    PlaneID: number;
    FloorID: number;
    GroupID: number;
    ConfigID: number;
    InitialEnable: boolean;
    Name: TextMap;
    Desc: TextMap;
    ShowMonsterList: number[];
    RewardList: number[];
    IsShowRewardCount: boolean;
    isShowCleared: boolean;
}

const MappingInfoExcelTable = _MappingInfoExcelTable as { [key: `${number}:${number}`]: MappingInfoExcelEntry };


export default class MappingInfoExcel {
    private constructor() { }

    public static fromId(id: number, wl: number = 0) {
        const query = MappingInfoExcelTable[`${id}:${wl}`];
        return query || MappingInfoExcelTable[`${id}:0`];
    }
}