import { SetClientPausedCsReq, SetClientPausedScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as SetClientPausedCsReq;
    session.send(SetClientPausedScRsp, { retcode: 0, paused: body.paused });
}