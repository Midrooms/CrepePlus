import _AvatarExcelTable from "../../data/excel/AvatarExcelTable.json";
const AvatarExcelTable = _AvatarExcelTable as { [key: string]: AvatarExcelTableEntry };

export default class AvatarExcel {
    private constructor() { }

    public static fromId(id: number): AvatarExcelTableEntry {
        return AvatarExcelTable[id];
    }

    public static fromIds(ids: number[]): AvatarExcelTableEntry[] {
        return ids.map(id => AvatarExcel.fromId(id));
    }
}

interface Reward {
    ItemID: number,
    ItemNum: number,
}

interface TextMap {
    hash: number;
}

export interface AvatarExcelTableEntry {
    AvatarID: number;
    AvatarName: TextMap;
    AvatarFullName: TextMap;
    AdventurePlayerID: number;
    AvatarVOTag: string;
    Rarity: string;
    JsonPath: string;
    NatureID: number;
    DamageType: string;
    SPNeed: {
        RawValue: number;
    };
    ExpGroup: number;
    MaxPromotion: number;
    MaxRank: number;
    RankIDList: number[];
    RewardList: Reward[];
    RewardListMax: Reward[];
    SkillList: number[];
    AvatarBaseType: string;
    DefaultAvatarModelPath: string;
    DefaultAvatarHeadIconPath: string;
    AvatarSideIconPath: string;
    ActionAvatarHeadIconPath: string;
    AvatarBaseTypeIconPath: string;
    AvatarDialogHalfImagePath: string;
    UltraSkillCutInPrefabPath: string;
    UIAvatarModelPath: string;
    ManikinJsonPath: string;
    AvatarDesc: TextMap;
    AIPath: string;
    SkilltreePrefabPath: string;
    DamageTypeResistance: never[];
    Release: boolean;
    SideAvatarHeadIconPath: string;
    WaitingAvatarHeadIconPath: string;
    AvatarCutinImgPath: string;
    AvatarCutinBgImgPath: string;
    AvatarCutinFrontImgPath: string;
    AvatarCutinIntroText: TextMap;
    GachaResultOffset: number[];
    AvatarDropOffset: number[];
    AvatarTrialOffset: number[];
}