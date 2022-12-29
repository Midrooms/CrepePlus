import { AvatarType, EntityType, MotionInfo, SceneActorInfo, SceneEntityInfo, SceneNpcMonsterInfo, Vector } from "../../data/proto/StarRail";
import { Scene } from "../Scene";
import { Entity } from "./Entity";

export class MonsterEntity extends Entity
{
    public mapLayer: number = 0;

    constructor(readonly scene: Scene, public readonly monsterId: number, public pos: Vector, public rot?: Vector){
        super(scene, pos, rot);
    }

    public getSceneEntityInfo(): SceneEntityInfo {
        const sceneEntityInfo = super.getSceneEntityInfo();
        sceneEntityInfo.npcMonster = {
            eventId: 1,
            isGenMonster: true,
            isSetWorldLevel: false,
            worldLevel: 1,//hardcoded
            monsterId: this.monsterId,
        } as SceneNpcMonsterInfo;
        return sceneEntityInfo;
    }

    public getEntityType(): EntityType {
        return EntityType.ENTITY_MONSTER;
    }

}
