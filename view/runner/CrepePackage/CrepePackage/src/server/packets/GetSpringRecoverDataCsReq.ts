import { GetSpringRecoverDataScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    session.send(GetSpringRecoverDataScRsp, {
        retcode: 0,
        healPoolInfo: {
            healPool: 0,
            refreshTime: 600,
        },
        springRecoverConfig: {
            autoRecoverHp: true,
            defaultHp: 100,
            avatarPresetHpList: []
        }
    } as GetSpringRecoverDataScRsp);
}