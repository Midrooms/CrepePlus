import { AvatarType, EntityType, MotionInfo, SceneActorInfo, SceneEntityInfo, Vector } from "../../data/proto/StarRail";
import { Scene } from "../Scene";
import { Entity } from "./Entity";

export class ActorEntity extends Entity
{
    public mapLayer: number = 0;

    constructor(readonly scene: Scene, public readonly avatarId: number, public pos: Vector, public rot?: Vector){
        super(scene, pos, rot);
    }

    public getSceneActorInfo(): SceneEntityInfo {
        return {
            ...super.getSceneEntityInfo(),
            actor: {
                avatarType: AvatarType.AVATAR_FORMAL_TYPE,
                baseAvatarId: this.avatarId,
                uid: this.scene.player.db._id,
                mapLayer: 0 //?
            }
        };
    }

    public getEntityType(): EntityType {
        return EntityType.ENTITY_AVATAR;
    }

}
