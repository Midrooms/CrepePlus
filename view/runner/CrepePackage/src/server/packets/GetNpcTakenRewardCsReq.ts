import { GetNpcTakenRewardCsReq, GetNpcTakenRewardScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as GetNpcTakenRewardCsReq;

    session.send(GetNpcTakenRewardScRsp, {
        retcode: 0,
        npcId: body.npcId,
        talkEventList: []
    } as GetNpcTakenRewardScRsp);
}