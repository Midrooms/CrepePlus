import { GetFirstTalkNpcCsReq, GetFirstTalkNpcScRsp, NpcMeetStatus } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as GetFirstTalkNpcCsReq;

    const dataObj = {
        retcode: 0,
        npcMeetStatusList: []
    } as GetFirstTalkNpcScRsp;

    body.seriesIdList.forEach(series => {
        const meetStatusObj = {
            seriesId: series,
            isMeet: false
        } as NpcMeetStatus;

        dataObj.npcMeetStatusList.push(meetStatusObj);
    });

    session.send(GetFirstTalkNpcScRsp, dataObj);
}