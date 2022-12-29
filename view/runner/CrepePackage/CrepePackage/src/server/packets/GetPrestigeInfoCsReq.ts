import { GetPrestigeInfoScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    session.send(GetPrestigeInfoScRsp, {
        retcode: 0,
        prestigeInfo: {
            exp: 0,
            level: 10,
            prestigeId: 100,
            takenLevelList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }
    } as GetPrestigeInfoScRsp);
}