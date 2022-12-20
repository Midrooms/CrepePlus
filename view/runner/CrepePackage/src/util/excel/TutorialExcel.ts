import TutorialDataExcelTable from "../../data/excel/TutorialDataExcelTable.json";

export default class TutorialExcel {
    private constructor() { }

    public static fromId(id: number) {
        return Object.values(TutorialDataExcelTable).find(tutorial => tutorial.TutorialID === id);
    }

    public static all() {
        return Object.values(TutorialDataExcelTable);
    }
}