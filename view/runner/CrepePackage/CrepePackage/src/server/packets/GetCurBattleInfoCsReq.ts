import { AvatarType, BattleAvatar, BattleEndStatus, GetCurBattleInfoScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const lineup = await session.player.getLineup();

    session.send(GetCurBattleInfoScRsp, {
        retcode: 0,
        avatarList: lineup.avatarList.map(list => {
            return {
                avatarType: list.avatarType,
                equipmentList: [{
                    id: 20003,
                    level: 1,
                    promotion: 1,
                    rank: 1
                }],
                hp: list.hp,
                id: list.id,
                index: list.slot,
                level: 1,
                promotion: 1,
                rank: 1,
                relicList: [],
                skilltreeList: []
            } as unknown as BattleAvatar;
        }),
        stageId: 1,
        logicRandomSeed: 2503,
        battleInfo: {},
        lastEndStatus: BattleEndStatus.BATTLE_END_WIN,
        lastEventId: 1
    } as GetCurBattleInfoScRsp);
}