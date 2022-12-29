import _RaidConfigExcelTable from "../../data/excel/RaidConfigExcelTable.json";
const RaidConfigExcelTable = _RaidConfigExcelTable as { [key: string]: RaidConfigExcelTableEntry };

interface TextMap {
    hash: number;
}

interface Param {
    RawValue: number;
}

interface RaidConfigExcelTableEntry {
    RaidID: number;
    WorldLevel: number;
    Type: string;
    MappingInfoID: number;
    MonsterList: number[];
    MonsterHideList: number[];
    DisplayEventID: number;
    RaidName: TextMap;
    RaidDesc: TextMap;
    MapEntranceID: number;
    GroupID: number;
    ConfigIDList: number[];
    NpcMonsterIDList: number[];
    PlaneEventIDList: number[];
    BuffDesc: TextMap;
    ParamList: Param[];
    LimitIDList: number[];
    RecoverType: string[];
    FinishType: string;
    FinishParamList: number[];
    FinishAutoQuit: boolean;
    DropList: number[];
    StaminaCost: number;
    FailedType: string;
    FailedResult: string;
    LogoutType: string;
    TeamType: string;
    TrialAvatarList: number[];
    MainMissionID: number;
    IsEntryByProp: boolean;
}

export default class RaidExcelConfig {
    private constructor() { }

    public static fromId(id: number, wl: number = 0) {
        const key = `${id}:${wl}`;
        return RaidConfigExcelTable[key];
    }

    public static all() {
        return Object.values(RaidConfigExcelTable);
    }

    public static find(id: number) {
        return Object.values(RaidConfigExcelTable).find(x => x.RaidID === id);
    }
}