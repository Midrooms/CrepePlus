import TutorialGuideGroupExcelTable from "../../data/excel/TutorialGuideGroupExcelTable.json";

export default class TutorialGuideGroupExcel {
    private constructor() { }

    public static fromId(id: number) {
        return Object.values(TutorialGuideGroupExcelTable).find(tutorial => tutorial.GroupID === id);
    }

    public static all() {
        return Object.values(TutorialGuideGroupExcelTable);
    }
}