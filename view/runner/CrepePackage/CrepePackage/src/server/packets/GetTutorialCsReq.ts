import { GetTutorialScRsp, TutorialStatus } from "../../data/proto/StarRail";
import TutorialExcel from "../../util/excel/TutorialExcel";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const tutorialIds = TutorialExcel.all().map(x => x.TutorialID);

    const dataObj: GetTutorialScRsp = {
        retcode: 0,
        tutorialList: []
    }

    tutorialIds.forEach(id => {
        dataObj.tutorialList.push({
            id,
            status: TutorialStatus.TUTORIAL_FINISH
        });
    });

    session.send(GetTutorialScRsp, dataObj);
}