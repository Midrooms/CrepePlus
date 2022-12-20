import { GachaInfo, GetGachaInfoCsReq, GetGachaInfoScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";
import Banner from './../../util/Banner';

export default async function handle(session: Session, packet: Packet) {
    session.send(GetGachaInfoScRsp, {
        gachaRandom: 0,
        retcode: 0,
        gachaInfoList: Banner.config.map(banner => {
            return {
                beginTime: 0,
                endTime: 1924992000,
                gachaId: banner.gachaId,
                detailWebview: banner.detailWebview,
                newbieGachaCnt: 0,
                todayGachaCnt: 0
            } as GachaInfo
        }),
        todaySingleGachaMaxCnt: 10,
        todayTotalGachaCnt: 10,
    } as GetGachaInfoScRsp);
}
