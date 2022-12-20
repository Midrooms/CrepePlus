import { LockEquipmentCsReq, LockEquipmentScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as LockEquipmentCsReq;

    // Fetch the equipment in question.
    const inventory = await session.player.getInventory();
    const equipment = inventory.getEquipmentByUid(body.equipmentUniqueId);

    if (!equipment) {
        session.send(LockEquipmentScRsp, { retcode: 1 } as LockEquipmentScRsp);
    }

    // Toggle the equipment's lock.
    equipment.isProtected = !equipment.isProtected;
    await inventory.save();

    // Done. Send and sync.
    inventory.sendEquipmentUpdate();
    session.send(LockEquipmentScRsp, {
        retcode: 0,
        equipmentUniqueId: body.equipmentUniqueId
    } as LockEquipmentScRsp);
}