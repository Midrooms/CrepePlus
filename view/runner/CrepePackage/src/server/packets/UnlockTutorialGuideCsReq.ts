import { TutorialStatus, UnlockTutorialGuideCsReq, UnlockTutorialGuideScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as UnlockTutorialGuideCsReq;

    session.send(UnlockTutorialGuideScRsp, {
        retcode: 0,
        tutorialGuide: {
            id: body.groupId,
            status: TutorialStatus.TUTORIAL_FINISH
        }
    } as UnlockTutorialGuideScRsp);
}