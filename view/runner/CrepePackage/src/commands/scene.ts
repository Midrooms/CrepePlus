import Logger from "../util/Logger";
import { ActorEntity } from "../game/entities/Actor";
import Interface, { Command } from "./Interface";
import { GetCurSceneInfoScRsp } from "../data/proto/StarRail";
import MazePlaneExcel from "../util/excel/MazePlaneExcel";
import MapEntryExcel from "../util/excel/MapEntryExcel";
const c = new Logger("/scene", "blue");

export default async function handle(command: Command) {
    if (!Interface.target) {
        c.log("No target specified");
        return;
    }

    const planeID = MazePlaneExcel.fromPlaneId(parseInt(command.args[0]));
    const entryId = MapEntryExcel.fromFloorId(planeID.StartFloorID).ID;
    const posData = Interface.target.player.db.posData;
    
    const lineup2 = await Interface.target.player.getLineup();
    const curAvatarEntity = new ActorEntity(Interface.target.player.scene, lineup2.avatarList[0].id, posData.pos);

    if (!planeID) return c.log("Usage: /scene <planeID>");

    // Update scene information on player.
    Interface.target.player.db.posData.planeID = planeID!.PlaneID;
    Interface.target.player.db.posData.floorID = planeID!.StartFloorID;
    await Interface.target.player.save()

    //ty for tamilpp25 scene
    Interface.target.send(GetCurSceneInfoScRsp, {
        retcode: 0,
        scene: {
            planeId: planeID.PlaneID,
            floorId: planeID.StartFloorID,
            entityList: [
                curAvatarEntity
            ],
            entityBuffList: [],
            entryId: entryId,
            envBuffList: [],
            gameModeType: MazePlaneExcel.getGameModeForPlaneType(planeID.PlaneType),
            lightenSectionList: []
        },
    } as unknown as GetCurSceneInfoScRsp);
    Interface.target.player.scene.spawnEntity(curAvatarEntity, true);

    Interface.target.sync();

    c.log(`Scene set to PlaneID: ${planeID.PlaneID}`);
}
