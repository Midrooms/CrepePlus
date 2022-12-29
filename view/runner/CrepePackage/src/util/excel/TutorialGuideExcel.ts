import TutorialGuideDataExcelTable from "../../data/excel/TutorialGuideDataExcelTable.json";

export default class TutorialGuideExcel {
    private constructor() { }

    public static fromId(id: number) {
        return Object.values(TutorialGuideDataExcelTable).find(tutorial => tutorial.ID === id);
    }

    public static all() {
        return Object.values(TutorialGuideDataExcelTable);
    }
}