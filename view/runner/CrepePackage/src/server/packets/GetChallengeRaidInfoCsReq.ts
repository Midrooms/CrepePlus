import { GetChallengeRaidInfoScRsp } from "../../data/proto/StarRail";
import RaidConfigExcel from "../../util/excel/RaidConfigExcel";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const activities = RaidConfigExcel.all();

    const dataObj: GetChallengeRaidInfoScRsp = {
        retcode: 0,
        challengeRaidList: [],
        takenRewardIdList: []
    }

    activities.forEach(activity => {
        dataObj.challengeRaidList.push({
            maxScore: 0,
            raidId: activity.RaidID
        });
    })

    session.send(GetChallengeRaidInfoScRsp, dataObj);
}