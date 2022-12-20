import {
    JoinLineupCsReq,
    JoinLineupScRsp,
    SyncLineupNotify,
    SyncLineupReason
} from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

// JoinLineupCsReq { baseAvatarId: 1002, slot: 1 }
export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as JoinLineupCsReq;
    session.send(JoinLineupScRsp, {retcode: 0});

    // Replace avatar in the player's lineup.
    const slot = body.slot ?? 0;
    const index = body.index ?? 1;

    session.player.db.lineup.lineups[index].avatarList[slot] = body.baseAvatarId;
    await session.player.save();

    session.send(SyncLineupNotify, {
        lineup: await session.player.getLineup(index),
        reasonList: [SyncLineupReason.SYNC_REASON_NONE]
    } as SyncLineupNotify);
}
