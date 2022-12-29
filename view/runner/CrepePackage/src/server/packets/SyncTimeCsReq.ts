import { SyncTimeCsReq, SyncTimeScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as SyncTimeCsReq;

    session.send(SyncTimeScRsp, {
        retcode: 0,
        clientTimeMs: body.clientTimeMs,
        serverTimeMs: Math.round(new Date().getTime() / 1000)
    } as SyncTimeScRsp);
}