import { GetShopListScRsp, GetShopListCsReq, Shop, Goods } from "../../data/proto/StarRail";
import ShopConfigExcel from "../../util/excel/ShopConfigExcel";
import ShopGoodsConfigExcel from "../../util/excel/ShopGoodsConfigExcel";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as GetShopListCsReq;

    const dataObj = {
        retcode: 0,
        shopType: body.shopType,
        shopList: []
    } as GetShopListScRsp;

    // Get all shops from the excels.
    ShopConfigExcel.all().forEach(shop => {
        const shopObj = {
            shopId: shop.ShopID,
            beginTime: 0,
            endTime: Date.now() * 2,
            goodsList: []
        } as Shop;

        // Add goods for this shop.
        ShopGoodsConfigExcel.fromShopId(shop.ShopID).forEach(goods => {
            const goodsObj = {
                goodsId: goods.GoodsID,
                buyTimes: 0,
                beginTime: 0,
                endTime: Date.now() * 2,
            } as Goods;

            shopObj.goodsList.push(goodsObj);
        });

        dataObj.shopList.push(shopObj);
    });

    session.send(GetShopListScRsp, dataObj);
}