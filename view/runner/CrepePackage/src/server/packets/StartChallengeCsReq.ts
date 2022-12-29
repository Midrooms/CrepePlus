import { ChallengeStatus, CurChallenge, ExtraLineupType, Maze, SceneActorInfo, SceneEntityInfo, SceneInfo, SceneNpcInfo, SceneNpcMonsterInfo, ScenePropInfo, StartChallengeCsReq, StartChallengeScRsp } from "../../data/proto/StarRail";
import { ActorEntity } from "../../game/entities/Actor";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

// StartChallengeCsReq { challengeId: 101 }
export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as StartChallengeCsReq;
    console.log(JSON.stringify(body, undefined, 4));

    // TODO: This packet is just a base
    const _lineup = session.player.db.lineup;
    const lineup = _lineup.lineups[_lineup.curIndex];
    const curAvatarEntity = new ActorEntity(session.player.scene, lineup.avatarList[lineup.leaderSlot], { x: 0, y: 0, z: 0 });

    session.send(StartChallengeScRsp, {
        retcode: 0,
        curChallenge: {
            challengeId: body.challengeId,
            rounds: 1,
            status: ChallengeStatus.CHALLENGE_DOING,
            extraLineupType: ExtraLineupType.LINEUP_NONE,
            killMonsterList: [],
            deadAvatarNum: 0,
        } as CurChallenge,
        maze: {
            // ? Data from MappingInfoExcelTable
            id: 30104,
            mapEntryId: 3000401,
            floor: {
                floorId: 20121001,
                scene: {
                    planeId: 30104,
                    entryId: 3000401,
                    floorId: 30104001,
                    lightenSectionList: [],
                    gameModeType: 4,
                    entityList: [
                        curAvatarEntity.getSceneEntityInfo(),
                        { 
                            entityId: 10000, 
                            motion: {
                                pos: {
                                    x: 74719,
                                    y: 2014,
                                    z: -94205,
                                },
                                rot: {
                                    x: 0,
                                    y: 0,
                                    z: 0
                                }
                            },
                            groupId: 3,
                            instId: 1,
                            actor: {} as SceneActorInfo,
                            npc: {} as SceneNpcInfo,
                            prop: {} as ScenePropInfo,
                            npcMonster: {
                                monsterId: 1003020,
                                isGenMonster: false,
                                eventId: 0,
                                isSetWorldLevel: false,
                                worldLevel: 6
                            } as SceneNpcMonsterInfo
                        } as SceneEntityInfo,
                    ],
                    leaderEntityId: curAvatarEntity.entityId,
                    entityBuffList: [],
                    envBuffList: [],
                    snar: ""
                } as SceneInfo
            }
        } as Maze
    } as StartChallengeScRsp);
}