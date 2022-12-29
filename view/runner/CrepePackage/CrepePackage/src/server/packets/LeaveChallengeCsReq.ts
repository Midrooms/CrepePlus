import { GetCurSceneInfoScRsp, LeaveChallengeScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";
import MapEntryExcel from "../../util/excel/MapEntryExcel";
import MazePlaneExcel from "../../util/excel/MazePlaneExcel";
import { ActorEntity } from "../../game/entities/Actor";

export default async function handle(session: Session, packet: Packet) {
    const bfArray: number[] = [];
    for (let i = 0; i < 500; i++) {
        bfArray.push(i);
    }

    try {
        // Challenge maze data doesn't get saved to DB.. We can abuse this and fall back to default
        const posData = session.player.db.posData;
        const entry = MapEntryExcel.fromFloorId(posData.floorID);
        const maze = MazePlaneExcel.fromPlaneId(posData.planeID);
        if (!entry || !maze) return session.send(LeaveChallengeScRsp, LeaveChallengeScRsp.fromPartial({ retcode: 2 }));

        const dataObj = LeaveChallengeScRsp.fromPartial({
            retcode: 0,
            maze: {
                floor: {
                    floorId: posData.floorID,
                    scene: {
                        entityList: [],
                        entryId: entry.ID,
                        floorId: entry.FloorID,
                        planeId: entry.PlaneID,
                        gameModeType: MazePlaneExcel.getGameModeForPlaneType(maze.PlaneType),
                        lightenSectionList: bfArray,
                        entityBuffList: [],
                        envBuffList: [],
                    }
                },
                id: posData.planeID,
                mapEntryId: entry.ID
            }
        });

        session.send(LeaveChallengeScRsp, dataObj);
    } catch (e) {
        session.c.error(e as Error);
        session.send(LeaveChallengeScRsp, LeaveChallengeScRsp.fromPartial({ retcode: 2 }));
    } finally {
        // Force us back
        const posData = session.player.db.posData;
        const entry = MapEntryExcel.fromFloorId(posData.floorID);
        const maze = MazePlaneExcel.fromPlaneId(posData.planeID);
        if (entry && maze) {
            const actor = new ActorEntity(session.player.scene, session.player.db.lineup.lineups[session.player.db.lineup.curIndex].avatarList[0], posData.pos).getSceneActorInfo();

            session.send(GetCurSceneInfoScRsp, {
                retcode: 0,
                scene: {
                    planeId: posData.planeID,
                    floorId: posData.floorID,
                    lightenSectionList: bfArray,
                    gameModeType: MazePlaneExcel.getGameModeForPlaneType(maze.PlaneType),
                    entityBuffList: [],
                    envBuffList: [],
                    entryId: entry.ID,
                    entityList: [actor],
                    leaderEntityId: actor.entityId
                }
            });
        }
    }
}