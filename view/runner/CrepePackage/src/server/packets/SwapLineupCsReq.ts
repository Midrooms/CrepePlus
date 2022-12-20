import { SwapLineupCsReq, SwapLineupScRsp, SyncLineupNotify, SyncLineupReason } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as SwapLineupCsReq;
    session.send(SwapLineupScRsp, { retcode: 0 } as SwapLineupScRsp);

    let lineup = await session.player.getLineup();
    const _copy = lineup.avatarList[body.dstSlot];
    lineup.avatarList[body.dstSlot] = lineup.avatarList[body.srcSlot];
    lineup.avatarList[body.srcSlot] = _copy;

    session.player.setLineup(lineup);
    session.player.save();

    session.send(SyncLineupNotify, {
        lineup: lineup,
        reasonList: [SyncLineupReason.SYNC_REASON_NONE]
    } as SyncLineupNotify);
}