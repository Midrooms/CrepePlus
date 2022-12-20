import { GetBasicInfoScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    session.send(GetBasicInfoScRsp, {
        curDay: 1,
        exchangeTimes: 0,
        retcode: 0,
        nextRecoverTime: Math.round(new Date().getTime() / 1000) + 100000,
        weekCocoonFinishedCount: 0
    } as GetBasicInfoScRsp)
}