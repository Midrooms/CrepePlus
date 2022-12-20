import { GetCurSceneInfoScRsp, MotionInfo, SceneEntityInfo, SceneNpcMonsterInfo, StartCocoonStageCsReq, Vector } from "../../data/proto/StarRail";
import { ActorEntity } from "../../game/entities/Actor";
import { PropEntity } from "../../game/entities/Prop";
import MapEntryExcel from "../../util/excel/MapEntryExcel";
import MazePlaneExcel from "../../util/excel/MazePlaneExcel";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    // Get data.
    const posData = session.player.db.posData;
    const _lineup = session.player.db.lineup;
    const lineup = _lineup.lineups[_lineup.curIndex];
    const curAvatarEntity = new ActorEntity(session.player.scene, lineup.avatarList[lineup.leaderSlot], posData.pos);
    const entryId = MapEntryExcel.fromFloorId(posData.floorID).ID;
    const mazePlane = MazePlaneExcel.fromPlaneId(posData.planeID);

    // Scene management.
    session.player.scene.spawnEntity(curAvatarEntity, true);
    session.player.scene.entryId = entryId;

    // Build response.
    const dataObj : GetCurSceneInfoScRsp = {
        retcode: 0,
        scene: {
            planeId: posData.planeID,
            floorId: posData.floorID,
            entityList: [
                curAvatarEntity.getSceneEntityInfo(),
                
            ],
            lightenSectionList: [],
            leaderEntityId: curAvatarEntity.entityId,
            entityBuffList: [],
            entryId: entryId,
            envBuffList: [],
            gameModeType: MazePlaneExcel.getGameModeForPlaneType(mazePlane.PlaneType),
        }
    };

    // Send response.
    session.send(GetCurSceneInfoScRsp, dataObj);
}