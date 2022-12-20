import { SceneEntityDisappearScNotify, SceneEntityUpdateScNotify } from "../data/proto/StarRail";
import Player from "../db/Player";
import { Entity } from "./entities/Entity";

export class Scene {
    public entryId!: number;
    public entities: Map<number, Entity> = new Map<number, Entity>();
    
    constructor(public readonly player: Player) {

    }

    public spawnEntity(entity: Entity, silent: boolean = false) {
        this.entities.set(entity.entityId, entity);
        if (!silent) {
            const dataObj : SceneEntityUpdateScNotify = {
                entityList: [entity.getSceneEntityInfo()]
            };

            this.player.session.send(SceneEntityUpdateScNotify, dataObj);
        }
    }

    public despawnEntity(entityId: number, silent: boolean = false) {
        this.entities.delete(entityId);
        if (!silent) {
            this.player.session.send(SceneEntityDisappearScNotify, {
                entityIdList: [entityId]
            } as SceneEntityDisappearScNotify);
        }
    }
}
