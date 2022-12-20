import { PromoteAvatarCsReq, PromoteAvatarScRsp } from "../../data/proto/StarRail";
import Avatar from "../../db/Avatar";
import { PayItemData } from "../../db/Inventory";
import AvatarPromotionExcel from "../../util/excel/AvatarPromotionExcel";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as PromoteAvatarCsReq;
    const inventory = await session.player.getInventory();

    // Get the target avatar.
    const avatarId = body.baseAvatarId;
    const avatar = await Avatar.loadAvatarForPlayer(session.player, avatarId);
    const promotionExcelData = AvatarPromotionExcel.fromId(`${avatarId}:${avatar.db.promotion}`);

    // Build list of consumed items. We take this from the excel, instead of the Req.
    const costMaterialList = promotionExcelData.PromotionCostList.map(c => { return { id: c.ItemID, count: c.ItemNum } as PayItemData });

    // Try consuming materials.
    const success = await inventory.payItems(costMaterialList);
    if (!success) {
        // ToDo: Correct retcode.
        session.send(PromoteAvatarScRsp, { retcode: 1 } as PromoteAvatarScRsp);
        return;
    }

    await inventory.save();

    // Promote the avatar and save.
    avatar.db.promotion++;
    await avatar.save();
    
    // Done. Sync and send response.
    await session.sync();
    session.send(PromoteAvatarScRsp, { retcode: 0 } as PromoteAvatarScRsp);
}