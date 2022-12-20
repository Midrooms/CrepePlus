import { Gender, GetHeroBasicTypeInfoScRsp, HeroBasicType } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    let gender: Gender = (session.player.db.heroBasicType % 2 === 0) ? Gender.GenderWoman : Gender.GenderMan;

    session.send(GetHeroBasicTypeInfoScRsp, {
        retcode: 0,
        gender: gender,
        basicTypeInfoList: [{
            basicType: session.player.db.heroBasicType,
            rank: 1,
            skillTreeList: []
        }],
        curBasicType: session.player.db.heroBasicType,
        heroPathList: [],
        isPlayerInfoModified: false,
        isGenderModified: false
    } as GetHeroBasicTypeInfoScRsp);
}