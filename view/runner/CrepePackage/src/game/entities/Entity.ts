import { EntityType, MotionInfo, SceneEntityInfo, Vector } from "../../data/proto/StarRail";
import { Scene } from "../Scene";

export abstract class Entity{
    static nextEntityId: number = 0;
    readonly entityId: number;

    constructor(readonly scene: Scene, public pos: Vector, public rot?: Vector){
        this.entityId = Entity.nextEntityId++;
    }

    public abstract getEntityType(): EntityType;

    public getSceneEntityInfo(): SceneEntityInfo{
        return {
            entityId: this.entityId,
            groupId: 1,
            instId: 1,
            motion: {
                pos: this.pos,
                rot: this.rot ?? {
                    x: 0,
                    y: 0,
                    z: 0,
                },
            } as MotionInfo,
            actor: {},
            npc: {},
            npcMonster: {},
            prop: {}
        } as SceneEntityInfo;
    }
}
