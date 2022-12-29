import { GetTutorialGuideScRsp, TutorialStatus } from "../../data/proto/StarRail";
import TutorialGuideExcel from "../../util/excel/TutorialGuideExcel";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const tutorialGuideIds = TutorialGuideExcel.all().map(x => x.ID);

    const dataObj: GetTutorialGuideScRsp = {
        retcode: 0,
        tutorialGuideList: []
    }

    tutorialGuideIds.forEach(id => {
        dataObj.tutorialGuideList.push({
            id,
            status: TutorialStatus.TUTORIAL_FINISH
        });
    });

    session.send(GetTutorialGuideScRsp, dataObj);
}