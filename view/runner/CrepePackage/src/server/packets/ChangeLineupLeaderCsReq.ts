import { ChangeLineupLeaderCsReq, ChangeLineupLeaderScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as ChangeLineupLeaderCsReq;

    session.send(ChangeLineupLeaderScRsp, {
        retcode: 0,
        slot: body.slot
    } as ChangeLineupLeaderScRsp);
}