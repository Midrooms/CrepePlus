import { DressAvatarCsReq, DressAvatarScRsp } from "../../data/proto/StarRail";
import Avatar from "../../db/Avatar";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as DressAvatarCsReq;

    const avatar = await Avatar.loadAvatarForPlayer(session.player, body.baseAvatarId);

    avatar.db.equipmentUniqueId = body.equipmentUniqueId;
    await avatar.save();

    session.send(DressAvatarScRsp, { retcode: 0 });
    session.sync();
}