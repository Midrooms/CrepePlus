import { GetChallengeScRsp } from "../../data/proto/StarRail";
import ChallengeActivityRaidConfigExcel from "../../util/excel/ChallengeActivityRaidConfigExcel";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const activities = ChallengeActivityRaidConfigExcel.all();

    const dataObj: GetChallengeScRsp = {
        retcode: 0,
        challengeList: []
    }

    activities.forEach(activity => {
        dataObj.challengeList.push({
            challengeId: activity.ChallengeID,
            stars: 0,
            takenReward: 0
        });
    });

    session.send(GetChallengeScRsp, dataObj);
}