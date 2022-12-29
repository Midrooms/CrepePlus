// import { Avatar as AvatarI, AvatarType, LineupAvatar } from '../data/proto/StarRail';
import { AvatarSkillTree, AvatarType, EquipRelic, Avatar as AvatarProto } from '../data/proto/StarRail';
import Logger from '../util/Logger';
import Database from './Database';
import Player, { LineupI } from './Player';
const c = new Logger("Avatar");
type UID = number | string;

interface AvatarI {
    ownerUid: number,
    baseAvatarId: number,
    avatarType: AvatarType,
    level: number,
    exp: number,
    promotion: number,
    rank: number,
    equipmentUniqueId: number,
    equipRelicList: EquipRelic[],
    skilltreeList: AvatarSkillTree[],
    fightProps: {
        hp: number,
        sp: number,
        satiety: number
    }
}

export default class Avatar {
    public readonly player: Player;
    public readonly db: AvatarI;

    private constructor(player: Player, db: AvatarI) {
        this.player = player;
        this.db = db;
    }

    /********************************************************************************
        Create and fetch avatars from the database.
    ********************************************************************************/

    public static async loadAvatarsForPlayer(player: Player) : Promise<Avatar[]> {
        // Read avatars for this player from the database.
        const db = Database.getInstance();
        const avatars = await db.getAll("avatars", { ownerUid: player.uid }) as unknown as AvatarI[];

        // If this player doesn't have any avatars yet, add a default.
        if (avatars.length < 1) {
            avatars.push({
                ownerUid: player.uid,
                baseAvatarId: 1001,
                avatarType: AvatarType.AVATAR_FORMAL_TYPE,
                level: 1,
                exp: 0,
                promotion: 0,
                rank: 0,
                equipmentUniqueId: 20003,
                equipRelicList: [],
                skilltreeList: [],
                fightProps: {
                    hp: 10000,
                    sp: 10000,
                    satiety: 100
                }
            } as AvatarI);
        }

        // Construct Avatar instances.
        const res: Avatar[] = []
        for (const avatar of avatars) {
            res.push(new Avatar(player, avatar));
        }

        // Done.
        return res;
    }

    public static async loadAvatarForPlayer(player: Player, baseAvatarId: number) : Promise<Avatar> {
        // Fetch the given avatar from the database.
        const db = Database.getInstance();
        const avatar = await db.get("avatars", { ownerUid: player.uid, baseAvatarId: baseAvatarId }) as unknown as AvatarI;

        // Sanity check.
        if (!avatar) {
            throw new Error(`Avatar ${baseAvatarId} does not exist for player ${player.uid}. This should never happen. Check your logic at the callsite.`);
        }

        // Done.
        return new Avatar(player, avatar);
    }

    public static async hasAvatar(player: Player, baseAvatarId: number) : Promise<boolean> {
        // Fetch the given avatar from the database.
        const db = Database.getInstance();
        const avatar = await db.get("avatars", { ownerUid: player.uid, baseAvatarId: baseAvatarId }) as unknown as AvatarI;

        // Return.
        return avatar ? true : false;
    }

    public static async addAvatarToPlayer(player: Player, baseAvatarId: number) : Promise<Avatar> {
        const db = Database.getInstance();

        // Make sure the player doesn't already have that avatar.
        const existingAvatar = await db.get("avatars", { ownerUid: player.uid, baseAvatarId: baseAvatarId }) as unknown as AvatarI;
        if (existingAvatar) {
            return new Avatar(player, existingAvatar);
        }

        // Insert.
        const data : AvatarI = {
            ownerUid: player.uid,
            baseAvatarId: baseAvatarId,
            avatarType: AvatarType.AVATAR_FORMAL_TYPE,
            level: 1,
            exp: 0,
            promotion: 0,
            rank: 0,
            equipmentUniqueId: 20003,
            equipRelicList: [],
            skilltreeList: [],
            fightProps: {
                hp: 10000,
                sp: 10000,
                satiety: 100
            }
        };
        await db.set("avatars", data);
        return new Avatar(player, data);
    }

    public static async removeAvatarFromPlayer(player: Player, baseAvatarId: number) {
        const db = Database.getInstance();
        await db.delete("avatars", { ownerUid: player.uid, baseAvatarId: baseAvatarId });
    }

    public static async getAvatarsForLineup(player: Player, lineup: LineupI) : Promise<Avatar[]> {
        const res: Avatar[] = [];

        // Load all avatars in this lineup.
        for (const avatarId of lineup.avatarList) {
            res.push(await Avatar.loadAvatarForPlayer(player, avatarId));
        }

        // Done.
        return res;
    }

    public async save() {
        const db = Database.getInstance();
        await db.update("avatars", { ownerUid: this.player.uid, baseAvatarId: this.db.baseAvatarId }, this.db);
    }

    /********************************************************************************
        Get avatar info.
    ********************************************************************************/
    public asAvatarProto() : AvatarProto {
        return {
            baseAvatarId: this.db.baseAvatarId,
            exp: this.db.exp,
            level: this.db.level,
            promotion: this.db.promotion,
            rank: this.db.rank,
            skilltreeList: this.db.skilltreeList,
            equipmentUniqueId: this.db.equipmentUniqueId,
            equipRelicList: this.db.equipRelicList
        };
    }
}