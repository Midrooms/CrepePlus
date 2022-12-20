import { GetMissionEventDataScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    session.send(GetMissionEventDataScRsp, {
        retcode: 0,
        missionEventList: []
    } as unknown as GetMissionEventDataScRsp);
}