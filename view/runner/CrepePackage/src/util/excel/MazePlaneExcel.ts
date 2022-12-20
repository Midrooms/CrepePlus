import _MazePlaneExcelTable from "../../data/excel/MazePlaneExcelTable.json";
import MapEntryExcel from "./MapEntryExcel";

interface MazePlaneExcelTableEntry {
    PlaneID: number;
    PlaneType: string;
    SubType: number;
    WorldID: number;
    PlaneName: string;
    StartFloorID: number;
    FloorIDList: number[];
}

const MazePlaneExcelTable = _MazePlaneExcelTable as { [key: string]: MazePlaneExcelTableEntry };

export default class MazePlaneExcel {
    private constructor() { }

    public static fromEntryId(entryId: number): MazePlaneExcelTableEntry {
        const mapEntry = MapEntryExcel.fromId(entryId);
        return MazePlaneExcelTable[mapEntry.PlaneID.toString()];
    }

    public static fromPlaneId(planeId: number): MazePlaneExcelTableEntry {
        return MazePlaneExcelTable[planeId.toString()];
    }

    public static getGameModeForPlaneType(planeType: string): number {
        switch (planeType) {
            case "Town": return 1;
            case "Maze": return 2;
            case "Train": return 3;
            case "Challenge": return 4;
            case "RogueExplore": return 5;
            case "RogueChallenge": return 6;
            case "TownRoom": return 7;
            case "Raid": return 8;
            case "FarmRelic": return 9;
            case "Client": return 10;
            case "ChallengeActivity": return 11;
        }

        return 0;
    }
}