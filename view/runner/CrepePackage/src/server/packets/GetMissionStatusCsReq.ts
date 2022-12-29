import { GetMissionStatusCsReq, GetMissionStatusScRsp, MissionStatus } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as GetMissionStatusCsReq;

    const dataObj = {
        retcode: 0,
        finishedMainMissionIdList: [
            1000101, 
            1000112, 
            1000113, 
            1000201, 
            1000202, 
            1000204, 
            1000301, 
            1000401, 
            1000402, 
            1000410, 
            1000510,
            1000601,
            1010301, 
            1010302, 
            1010401,
            1010403, 
            1010701,
            1011403,
            1010202,
            1010902,
            1011102,
            4010101
        ],
        missionEventStatusList: [],
        subMissionStatusList: [],
        unfinishedMainMissionIdList: []
    } as GetMissionStatusScRsp;

    body.mainMissionIdList.forEach(id => { dataObj.unfinishedMainMissionIdList.push(id); });

    body.missionEventIdList.forEach(id => {
        dataObj.missionEventStatusList.push({
            id: id,
            progress: 0,
            status: MissionStatus.MISSION_FINISH
        });
    });

    body.subMissionIdList.forEach(id => {
        dataObj.subMissionStatusList.push({
            id: id,
            progress: 0,
            status: MissionStatus.MISSION_FINISH
        });
    });

    session.send(GetMissionStatusScRsp, dataObj);
}