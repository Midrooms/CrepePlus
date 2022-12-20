import { AvatarType, GetAllLineupDataScRsp, LineupInfo } from "../../data/proto/StarRail";
import Avatar from "../../db/Avatar";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    let lineup = session.player.db.lineup;

    const lineupList: Array<LineupInfo> = [];
    for (const l of Object.values(session.player.db.lineup.lineups)) {
        const lineup = await session.player.getLineup(l.index);
        lineupList.push(lineup);
    }

    const dataObj = {
        retcode: 0,
        curIndex: lineup.curIndex,
        lineupList
    } as GetAllLineupDataScRsp;

    session.send(GetAllLineupDataScRsp, dataObj);
}