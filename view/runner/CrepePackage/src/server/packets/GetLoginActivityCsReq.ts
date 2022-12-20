import { GetLoginActivityScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    session.send(GetLoginActivityScRsp, {
        retcode: 0,
        loginActivityList: [{
            id: 1001,
            loginDays: 1,
            hasTakenLoginActivityRewardDaysList: []
        }]
    } as GetLoginActivityScRsp);
}