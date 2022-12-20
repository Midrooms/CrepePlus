import { Equipment, GetBagScRsp, Material, Relic } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const inventory = await session.player.getInventory();

    session.send(GetBagScRsp, {
        equipmentList: inventory.getEquipmentList(),
        materialList: inventory.getMaterialList(),
        relicList: inventory.getRelicsList(),
        retcode: 0,
        rogueItemList: [],
        waitDelResourceList: []
    } as GetBagScRsp);
}