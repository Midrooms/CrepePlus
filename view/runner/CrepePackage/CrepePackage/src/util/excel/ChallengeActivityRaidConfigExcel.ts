import ChallengeActivityRaidConfigExcelTable from "../../data/excel/ChallengeActivityRaidConfigExcelTable.json";

export default class ChallengeActivityRaidConfigExcel {
    private constructor() { }

    public static fromId(id: number) {
        return Object.values(ChallengeActivityRaidConfigExcelTable).find(x => x.ChallengeID === id);
    }

    public static all() {
        return Object.values(ChallengeActivityRaidConfigExcelTable);
    }
}