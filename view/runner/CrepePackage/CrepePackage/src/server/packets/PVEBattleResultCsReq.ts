import { BattleEndStatus, EnterMazeCsReq, EnterMazeScRsp, Item, ItemList, PVEBattleResultCsReq, PVEBattleResultScRsp } from "../../data/proto/StarRail";
import MapEntryExcel from "../../util/excel/MapEntryExcel";
import MazePlaneExcel from "../../util/excel/MazePlaneExcel";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as PVEBattleResultCsReq;

    // Add drops, for our little gambling addicts.
    const inventory = await session.player.getInventory();
    inventory.addItem(102, 10);
    await inventory.save();

    // Build response.
    const dataObj : PVEBattleResultScRsp = {
        retcode: 0,
        stageId: body.stageId,
        curFinishChallenge: 0,
        dropData: { itemList: [{ itemId: 102, num: 10 } as Item] } as ItemList,
        extraDropData: { itemList: [{ itemId: 102, num: 10 } as Item] } as ItemList,
        avatarExpReward: 0,
        binVer: "",
        resVer: "",
        battleId: body.battleId,
        endStatus: body.endStatus,
        checkIdentical: true,
        eventId: 0,
        mismatchTurnCount: 0
    };

    // Send response.
    session.send(PVEBattleResultScRsp, dataObj);
}