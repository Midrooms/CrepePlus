import { GetExpeditionDataScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    session.send(GetExpeditionDataScRsp, {
        retcode: 0,
        expedtionList: [],
        unlockedExpeditionIdList: [],
        teamCount: 4
    } as GetExpeditionDataScRsp);
}