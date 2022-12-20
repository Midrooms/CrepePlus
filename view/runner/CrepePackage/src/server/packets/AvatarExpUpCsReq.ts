import { AvatarExpUpCsReq, AvatarExpUpScRsp } from "../../data/proto/StarRail";
import Avatar from "../../db/Avatar";
import { PayItemData } from "../../db/Inventory";
import AvatarExcel from "../../util/excel/AvatarExcel";
import AvatarExpItemExcel from "../../util/excel/AvatarExpItemExcel";
import AvatarPromotionExcel from "../../util/excel/AvatarPromotionExcel";
import ExpTypeExcel from "../../util/excel/ExpTypeExcel";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as AvatarExpUpCsReq;
    const inventory = await session.player.getInventory();

    // Get the target avatar.
    const avatarId = body.baseAvatarId;
    const avatar = await Avatar.loadAvatarForPlayer(session.player, avatarId);
    const avatarExcelData = AvatarExcel.fromId(avatarId);

    // Determine the next level cap based on the avatar's current promotion.
    const levelCap = AvatarPromotionExcel.fromId(`${avatarId}:${avatar.db.promotion}`).MaxLevel;

    // Determine the EXP we get from the consumed items.
    let exp = 0;
    const costMaterialList = [];
    for (const item of body.itemCost!.itemList) {
        // Determine amount of EXP given by that item.
        // We know that the cost items given in this Req will be `PileItem`s.
        const expPerItem = AvatarExpItemExcel.fromId(item.pileItem!.itemId).Exp;

        // Add EXP for the number of items consumed.
        exp += expPerItem * item.pileItem!.itemNum;

        // Add material to cost.
        costMaterialList.push({ id: item.pileItem!.itemId, count: item.pileItem!.itemNum } as PayItemData);
    }

    // Determine cost, which is always 10% of EXP, and add to the list of cost materials.
    const coinCost = exp * 0.1;
    costMaterialList.push({ id: 2, count: coinCost } as PayItemData);

    // Try consuming materials.
    const success = await inventory.payItems(costMaterialList);
    if (!success) {
        // ToDo: Correct retcode.
        session.send(AvatarExpUpScRsp, { retcode: 1, returnItemList: [] } as AvatarExpUpScRsp);
        return;
    }

    await inventory.save();

    // Cost has been paid - now level up.
    let currentAvatarExp = avatar.db.exp + exp;
    let nextRequiredExp = ExpTypeExcel.fromId(`${avatarExcelData.ExpGroup}:${avatar.db.level}`).Exp;
    while (currentAvatarExp >= nextRequiredExp && avatar.db.level < levelCap) {
        // Increase level.
        avatar.db.level++;

        // Deduct EXP necessary for this level.
        currentAvatarExp -= nextRequiredExp;

        // Determine EXP necessary for the next level.
        nextRequiredExp = ExpTypeExcel.fromId(`${avatarExcelData.ExpGroup}:${avatar.db.level}`).Exp;
    }

    // Calculate the character's new EXP and any excess EXP.
    let excessExp = 0;
    if (avatar.db.level == levelCap) {
        avatar.db.exp = 0;
        excessExp = currentAvatarExp;
    }
    else {
        avatar.db.exp = currentAvatarExp;
    }

    // Save.
    await avatar.save();

    // ToDo: Handle return items.
    
    // Done. Sync and send response.
    await session.sync();

    session.send(AvatarExpUpScRsp, {
        retcode: 0,
        returnItemList: []
    } as AvatarExpUpScRsp);
}