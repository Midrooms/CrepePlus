import { GetMazeMapInfoCsReq, GetMazeMapInfoScRsp } from "../../data/proto/StarRail";
import MapEntryExcel from "../../util/excel/MapEntryExcel";
import MappingInfoExcel from "../../util/excel/MappingInfoExcel";
import MazePlaneExcel from "../../util/excel/MazePlaneExcel";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as GetMazeMapInfoCsReq;

    const mapping = MappingInfoExcel.fromId(body.entryId, session.player.db.basicInfo.worldLevel) || MappingInfoExcel.fromId(1001);

    const dataObj = {
        retcode: 0,
        entryId: body.entryId,
        lightenSectionList: [],
        mazePropList: [{ groupId: mapping.GroupID, configId: mapping.ConfigID, state: 0 }],
        mazeGroupList: [{ groupId: mapping.GroupID, modifyTime: 0 }],
        opendChestNum: 69,
        unlockTeleportList: []
    } as GetMazeMapInfoScRsp;

    // TODO: No excel info atm
    for (let i = 0; i < 500; i++) {
        dataObj.lightenSectionList.push(i)
    }

    dataObj.unlockTeleportList = MapEntryExcel.all().map(x => x.ID);

    session.send(GetMazeMapInfoScRsp, dataObj);
}