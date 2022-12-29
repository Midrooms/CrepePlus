import { GetHeroPathScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    session.send(GetHeroPathScRsp, {
        retcode: 0,
        heroPathList: []
    } as GetHeroPathScRsp);
}