import { GetMailScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    session.send(GetMailScRsp, {
        retcode: 0,
        mailList: [],
        noticeMailList: [],
        start: 0,
        totalNum: 0,
        isEnd: false
    } as GetMailScRsp);
}