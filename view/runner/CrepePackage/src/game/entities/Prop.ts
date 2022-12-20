import { EntityType, PropExtraInfo, SceneEntityInfo, SceneNpcMonsterInfo, ScenePropInfo, Vector } from "../../data/proto/StarRail";
import { Scene } from "../Scene";
import { Entity } from "./Entity";

export class PropEntity extends Entity
{
    public mapLayer: number = 0;

    constructor(readonly scene: Scene, public readonly propId: number, public pos: Vector, public rot?: Vector){
        super(scene, pos, rot);
    }

    public getSceneEntityInfo(): SceneEntityInfo {
        const sceneEntityInfo = super.getSceneEntityInfo();
        sceneEntityInfo.prop = {
            propId: this.propId,
            createTimeMs: Date.now(),
            extraInfo: {} as PropExtraInfo,
            lifeTimeMs: Date.now() + 1000 * 60 * 60,
            propState: 1,
        } as ScenePropInfo;
        return sceneEntityInfo;
    }

    public getEntityType(): EntityType {
        return EntityType.ENTITY_PROP;
    }

}
