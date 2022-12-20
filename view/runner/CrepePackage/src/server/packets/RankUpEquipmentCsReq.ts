import { RankUpEquipmentCsReq, RankUpEquipmentScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as RankUpEquipmentCsReq;
    const inventory = await session.player.getInventory();

    // Get equipment.
    const equipment = inventory.getEquipmentByUid(body.equipmentUniqueId);

    // Check if all sacrificed equipments exist.
    for (const id of body.equipmentIdList) {
        if (!inventory.getEquipmentByUid(id)) {
            session.send(RankUpEquipmentScRsp, { retcode: 1 } as RankUpEquipmentScRsp);
            return;
        }
    }

    // Remove sacrificed equipments.
    for (const id of body.equipmentIdList) {
        await inventory.removeEquipment(id);
    }

    // Increase rank and save.
    equipment.rank += body.equipmentIdList.length;
    await inventory.save();

    // Done. Send and sync.
    await session.sync();
    session.send(RankUpEquipmentScRsp, { retcode: 0 } as RankUpEquipmentScRsp);
}