import Session from "../kcp/Session";
import Packet from "../kcp/Packet";
import {SwitchLineupIndexCsReq, SwitchLineupIndexScRsp} from "../../data/proto/StarRail";

// SwitchLineupIndexCsReq { index: 0 }
export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as SwitchLineupIndexCsReq
    const index = body.index ?? 0

    session.send(SwitchLineupIndexScRsp, {
        retcode: 0,
        index: index
    })

    session.player.db.lineup.curIndex = index
    await session.player.save()

    // Todo: figure need to send SyncLineupNotify again ?
}
