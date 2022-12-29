import { FinishTalkMissionCsReq, FinishTalkMissionScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as FinishTalkMissionCsReq;

    session.send(FinishTalkMissionScRsp, {
        retcode: 0,
        talkStr: body.talkStr
    } as FinishTalkMissionScRsp);
}