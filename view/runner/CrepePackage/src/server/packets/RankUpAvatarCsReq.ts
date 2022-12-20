import { RankUpAvatarCsReq, RankUpAvatarScRsp } from "../../data/proto/StarRail";
import Avatar from "../../db/Avatar";
import { PayItemData } from "../../db/Inventory";
import Logger from "../../util/Logger";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";
const c = new Logger("RankUpAvatarCsReq");

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as RankUpAvatarCsReq;
    const dataObj: RankUpAvatarScRsp = {
        retcode: 0
    };

    try {
        const inv = await session.player.getInventory();
        if (!body.costData) return;
        const list = body.costData.itemList;
        const arr: Array<PayItemData> = [];

        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (!item.pileItem) continue;
            arr.push({
                count: item.pileItem.itemNum,
                id: item.pileItem.itemId
            });
        }

        if (await inv.payItems(arr)) {
            const avatar = await Avatar.loadAvatarForPlayer(session.player, body.baseAvatarId);
            avatar.db.rank = body.rank // gidra moment: ez hack
            await avatar.save();
        } else {
            dataObj.retcode = 1301;
        }
    } catch (e) {
        c.error(e as Error);
        dataObj.retcode = 2;
    } finally {
        session.send(RankUpAvatarScRsp, dataObj);
        session.sync();
    }
}