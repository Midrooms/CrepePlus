import { FinishTutorialGuideCsReq, FinishTutorialGuideScRsp, TutorialStatus } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as FinishTutorialGuideCsReq;

    const dataObj: FinishTutorialGuideScRsp = {
        retcode: 0,
        tutorialGuide: {
            status: TutorialStatus.TUTORIAL_FINISH,
            id: body.groupId
        },
        reward: { itemList: [] }
    }

    session.send(FinishTutorialGuideScRsp, dataObj);
}