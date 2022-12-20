import { ExpUpEquipmentCsReq, ExpUpEquipmentScRsp } from "../../data/proto/StarRail";
import { PayItemData } from "../../db/Inventory";
import EquipmentExcel from "../../util/excel/EquipmentExcel";
import EquipmentExpItemExcel from "../../util/excel/EquipmentExpItemExcel";
import EquipmentExpTypeExcel from "../../util/excel/EquipmentExpTypeExcel";
import EquipmentPromotionExcel from "../../util/excel/EquipmentPromotionExcel";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as ExpUpEquipmentCsReq;
    const inventory = await session.player.getInventory();

    // Get the target equipment.
    const equipmentId = body.equipmentUniqueId;
    const equipment = inventory.getEquipmentByUid(equipmentId);
    const equipmentExcelData = EquipmentExcel.fromId(equipment.tid);

    // Determine the next level cap based on the equipment's current promotion.
    const levelCap = EquipmentPromotionExcel.fromId(`${equipment.tid}:${equipment.promotion}`).MaxLevel;

    // Determine the EXP we get from the consumed items, and the coins it will cost.
    let exp = 0;
    let cost = 0;

    const costMaterialList = [];
    const costEquipmentList = []

    for (const item of body.costData!.itemList) {
        // Determine amount of EXP given by that item.
        // If the consumed item is a PileItem, we can fetch the EXP it gives from the excels.
        if (item.pileItem) {
            const expItemData = EquipmentExpItemExcel.fromId(item.pileItem.itemId);
            exp += expItemData.ExpProvide * item.pileItem.itemNum;
            cost += expItemData.CoinCost;

            costMaterialList.push({ id: item.pileItem.itemId, count: item.pileItem.itemNum } as PayItemData);
        }
        else if (item.equipmentUniqueId) {
            const consumedEquipment = inventory.getEquipmentByUid(item.equipmentUniqueId);
            const consumedEquipmentExcelData = EquipmentExcel.fromId(consumedEquipment.tid);

            exp += consumedEquipmentExcelData.ExpProvide;
            cost += consumedEquipmentExcelData.CoinCost;

            costEquipmentList.push(item.equipmentUniqueId);
        }
    }

    costMaterialList.push({ id: 2, count: cost } as PayItemData);

    // Try consuming materials.
    const success = await inventory.payItems(costMaterialList);
    if (!success) {
        // ToDo: Correct retcode.
        session.send(ExpUpEquipmentScRsp, { retcode: 1, returnItemList: [] } as ExpUpEquipmentScRsp);
        return;
    }

    for (const id of costEquipmentList) {
        await inventory.removeEquipment(id);
    }

    // Cost has been paid - now level up.
    let currentEquipmentExp = equipment.exp + exp;
    let nextRequiredExp = EquipmentExpTypeExcel.fromId(`${equipmentExcelData.ExpType}:${equipment.level}`).Exp;
    while (currentEquipmentExp >= nextRequiredExp && equipment.level < levelCap) {
        // Increase level.
        equipment.level++;

        // Deduct EXP necessary for this level.
        currentEquipmentExp -= nextRequiredExp;

        // Determine EXP necessary for the next level.
        nextRequiredExp = EquipmentExpTypeExcel.fromId(`${equipmentExcelData.ExpType}:${equipment.level}`).Exp;
    }

    // Calculate the equipment's new EXP and any excess EXP.
    let excessExp = 0;
    if (equipment.level == levelCap) {
        equipment.exp = 0;
        excessExp = currentEquipmentExp;
    }
    else {
        equipment.exp = currentEquipmentExp;
    }

    // Save.
    await inventory.save();

    // ToDo: Handle return items.
    
    // Done. Sync and send response.
    await session.sync();

    session.send(ExpUpEquipmentScRsp, {
        retcode: 0,
        returnItemList: []
    } as ExpUpEquipmentScRsp);
}