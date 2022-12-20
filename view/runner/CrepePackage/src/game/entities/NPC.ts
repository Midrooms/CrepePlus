import { EntityType, NpcExtraInfo, PropExtraInfo, SceneEntityInfo, SceneNpcInfo, SceneNpcMonsterInfo, ScenePropInfo, Vector } from "../../data/proto/StarRail";
import { Scene } from "../Scene";
import { Entity } from "./Entity";

export class NpcEntity extends Entity
{
    public mapLayer: number = 0;

    constructor(readonly scene: Scene, public readonly npcId: number, public pos: Vector, public rot?: Vector){
        super(scene, pos, rot);
    }

    public getSceneEntityInfo(): SceneEntityInfo {
        const sceneEntityInfo = super.getSceneEntityInfo();
        sceneEntityInfo.npc = {
            npcId: this.npcId,
            extraInfo: {} as NpcExtraInfo
        } as SceneNpcInfo;
        return sceneEntityInfo;
    }

    public getEntityType(): EntityType {
        return EntityType.ENTITY_PROP;
    }

}
