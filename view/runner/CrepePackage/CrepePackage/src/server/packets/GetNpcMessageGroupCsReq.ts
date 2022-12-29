import { GetNpcMessageGroupCsReq, GetNpcMessageGroupScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as GetNpcMessageGroupCsReq;

    const dataObj: GetNpcMessageGroupScRsp = {
        retcode: 0,
        messageGroupList: [],
    };

    session.send(GetNpcMessageGroupScRsp, dataObj);
}