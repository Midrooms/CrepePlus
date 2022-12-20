import { DoGachaCsReq, DoGachaScRsp, GachaItem, Item, ItemList } from "../../data/proto/StarRail";
import { PayItemData } from "../../db/Inventory";
import Banners from "../../util/Banner";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const gachaItemList: GachaItem[] = [];
    const body = packet.body as DoGachaCsReq;
    const banner = Banners.config.find(banner => banner.gachaId === body.gachaId)!;
    const combined = banner.rateUpItems4.concat(banner.rateUpItems5)

    // Pay currency.
    const inventory = await session.player.getInventory();
    const success = await inventory.payItems([{ id: banner.costItemId, count: body.gachaNum } as PayItemData]);

    if (!success) {
        session.send(DoGachaScRsp, {
            retcode: 1301
        } as DoGachaScRsp);
    }

    //bad gachaing but whatever....
    //TODO: pity system, proper logic
    for(let i = 0; i < body.gachaNum; i++){
        const result = combined[Math.floor(Math.random() * combined.length)];
        gachaItemList.push({
            gachaItem: {
                itemId: result,
                num: 1
            } as Item,
            tokenItem: {},
            transferItemList: {},
            isNew: true //TODO: avatar checking
        } as GachaItem);
    }
    session.send(DoGachaScRsp, {
        retcode: 0,
        gachaId: body.gachaId!,
        gachaNum: body.gachaNum!,
        newGachaRandom: body.gachaRandom!,
        newbieGachaCnt: 0,
        todayGachaCnt: 0,
        todayTotalGachaCnt: 0, //todo find out what are THESE
        gachaItemList: gachaItemList
    } as DoGachaScRsp);
}