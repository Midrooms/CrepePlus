import { GetLevelRewardTakenListScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    session.send(GetLevelRewardTakenListScRsp, {
        retcode: 0,
        takenLevelList: []
    } as GetLevelRewardTakenListScRsp);
}