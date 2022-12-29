import { SceneEntityMoveCsReq, SceneEntityMoveScRsp } from "../../data/proto/StarRail";
import { ActorEntity } from "../../game/entities/Actor";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as SceneEntityMoveCsReq;

    if (session.player.scene.entryId !== body.entryId) {
        return;
    }
    for (const entityMotion of body.entityMotionList) {
        const entity = session.player.scene.entities.get(entityMotion.entityId);
        if (!entity) { //what??
            // session.player.scene.despawnEntity(entityMotion.entityId);
            continue;
        }
        const motion = entityMotion.motion;
        if (!motion) {
            continue;
        }

        if (motion.pos && (Object.keys(motion.pos!).length > 0)) { //preventing motion sending empty pos causing the pos to be reset
            entity.pos = motion.pos;
            if (entity instanceof ActorEntity) {
                entity.mapLayer = entityMotion.mapLayer;
                session.player.db.posData.pos = {
                    x: motion.pos.x,
                    y: motion.pos.y,
                    z: motion.pos.z
                };
            }
        }

        entity.rot = (Object.keys(motion.rot!).length > 0) ? motion.rot : {
            x: 0,
            y: 0,
            z: 0,
        }
    }

    session.send(SceneEntityMoveScRsp, {
        retcode: 0,
        downloadData: undefined,
    } as SceneEntityMoveScRsp);
}