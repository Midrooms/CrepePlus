import { SetLineupNameCsReq, SetLineupNameScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as SetLineupNameCsReq;

    try {
        let curLineup = await session.player.getLineup();
        curLineup.name = body.name;
        session.player.setLineup(curLineup);
        session.player.save();
    } catch {
        session.c.error("Failed to set lineup name", false);
    }

    session.send(SetLineupNameScRsp, {
        retcode: 0,
        index: session.player.db.lineup.curIndex,
        name: body.name
    } as SetLineupNameScRsp);
}