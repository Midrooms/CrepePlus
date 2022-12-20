import { GetAvatarDataCsReq, GetAvatarDataScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";
import AvatarDb from "../../db/Avatar";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as GetAvatarDataCsReq;
    const avatars = await AvatarDb.loadAvatarsForPlayer(session.player);

    const dataObj = {
        retcode: 0,
        avatarList: avatars.map(av => av.asAvatarProto()),
        isAll: body.isGetAll
    };

    // Make sure we wait for this to send.
    // GetAvatarDataScRsp HAS to be sent immediately after the Req.
    await session.send(GetAvatarDataScRsp, dataObj);
}