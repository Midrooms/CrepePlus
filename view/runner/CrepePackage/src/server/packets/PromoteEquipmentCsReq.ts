import { PromoteEquipmentCsReq, PromoteEquipmentScRsp } from "../../data/proto/StarRail";
import { PayItemData } from "../../db/Inventory";
import EquipmentPromotionExcel from "../../util/excel/EquipmentPromotionExcel";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as PromoteEquipmentCsReq;
    const inventory = await session.player.getInventory();

    // Get the target avatar.
    const equipmentId = body.equipmentUniqueId;
    const equipment = inventory.getEquipmentByUid(equipmentId);
    const promotionExcelData = EquipmentPromotionExcel.fromId(`${equipment.tid}:${equipment.promotion}`);

    // Build list of consumed items. We take this from the excel, instead of the Req.
    const costMaterialList = promotionExcelData.PromotionCostList.map(c => { return { id: c.ItemID, count: c.ItemNum } as PayItemData });

    // Try consuming materials.
    const success = await inventory.payItems(costMaterialList);
    if (!success) {
        // ToDo: Correct retcode.
        session.send(PromoteEquipmentScRsp, { retcode: 1 } as PromoteEquipmentScRsp);
        return;
    }

    await inventory.save();

    // Promote the avatar and save.
    equipment.promotion++;
    await inventory.save();
    
    // Done. Sync and send response.
    await session.sync();
    session.send(PromoteEquipmentScRsp, { retcode: 0 } as PromoteEquipmentScRsp);
}