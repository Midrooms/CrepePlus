import Session from "../server/kcp/Session";
import { AvatarType, ExtraLineupType, HeroBasicType, LineupAvatar, LineupInfo, Vector } from "../data/proto/StarRail";
import Logger from "../util/Logger";
import Account from "./Account";
import Avatar from "./Avatar";
import Database from "./Database";
import { Scene } from "../game/Scene";
import Inventory from "./Inventory";
const c = new Logger("Player");

export interface LineupI {
    avatarList: number[];
    isVirtual: boolean;
    planeId: number;
    mp: number;
    leaderSlot: number;
    index: number;
    extraLineupType: ExtraLineupType;
    name: string;
}
interface PlayerI {
    _id: number;
    name: string;
    token: string;
    banned: boolean;
    heroBasicType: HeroBasicType;
    basicInfo: {
        nickname: string;
        level: number;
        exp: number;
        stamina: number;
        mcoin: number;
        hcoin: number;
        scoin: number;
        worldLevel: number;
    }
    lineup: {
        curIndex: number;
        lineups: {
            [key: number]: LineupI;
        };
    }
    posData: {
        floorID: number;
        planeID: number;
        pos: {
            x: number,
            y: number,
            z: number
        };
    }
}

export default class Player {
    public readonly uid: number
    public readonly scene: Scene;
    private inventory!: Inventory;

    private constructor(readonly session: Session, public readonly db: PlayerI) {
        this.uid = db._id;
        this.scene = new Scene(this);
    }

    public static async fromUID(session: Session, uid: number | string): Promise<Player | undefined> {
        if (typeof uid == "string") uid = Number(uid);
        const db = Database.getInstance();
        const player = await db.get("players", { _id: uid }) as unknown as PlayerI;
        if (!player) return Player.create(session, uid);
        return new Player(session, player);
    }

    public static async fromToken(session: Session, token: string): Promise<Player | undefined> {
        const db = Database.getInstance();
        const plr = await db.get("players", { token: token }) as unknown as PlayerI;
        if (!plr) return await Player.fromUID(session, (await Account.fromToken(token))?.uid || Math.round(Math.random() * 50000));

        return new Player(session, plr);
    }

    public async getLineup(lineupIndex?: number): Promise<LineupInfo> {
        // Get avatar data.
        const index = lineupIndex ?? this.db.lineup.curIndex;
        const lineup = this.db.lineup.lineups[index];
        const avatars = await Avatar.getAvatarsForLineup(this, lineup);

        // Construct LineupInfo.
        const lineupAvatars : LineupAvatar[] = [];
        for (let slot = 0; slot < avatars.length; slot++) {
            lineupAvatars.push({
                slot: slot,
                avatarType: avatars[slot].db.avatarType,
                id: avatars[slot].db.baseAvatarId,
                hp: avatars[slot].db.fightProps.hp,
                sp: avatars[slot].db.fightProps.sp,
                satiety: avatars[slot].db.fightProps.satiety
            });
        }

        return {
            ...lineup,
            index: index,
            avatarList: lineupAvatars
        }
    }

    public setLineup(lineup: LineupInfo, index?: number, curIndex: number = this.db.lineup.curIndex) {
        this.db.lineup.lineups[index || curIndex] = {
            ...lineup,
            avatarList: lineup.avatarList.map(x => x.id)
        };

        this.db.lineup.curIndex = curIndex;
    }

    public async getInventory() : Promise<Inventory> {
        // If this players inventory has not been loaded yet, do so now.
        if (!this.inventory) {
            this.inventory = await Inventory.loadOrCreate(this);
        }

        return this.inventory;
    }

    public static async create(session: Session, uid: number | string): Promise<Player | undefined> {
        if (typeof uid == "string") uid = Number(uid);
        const acc = await Account.fromUID(uid);
        if (!acc) {
            c.warn(`Account ${uid} not found`);
            return;
        }
        const db = Database.getInstance();

        const dataObj = {
            _id: acc.uid,
            name: acc.name,
            token: acc.token,
            heroBasicType: HeroBasicType.BoyWarrior,
            basicInfo: {
                exp: 0,
                level: 70,
                hcoin: 0,
                mcoin: 0,
                nickname: acc.name,
                scoin: 0,
                stamina: 180,
                worldLevel: 6,
            },
            lineup: {
                curIndex: 0,
                lineups: {}
            },
            posData: {
                floorID: 10001001,
                planeID: 10001,
                pos: {
                    x: 0,
                    y: 439,
                    z: -45507
                }
            },
            banned: false
        } as PlayerI;

        const LINEUPS = 6;
        for (let i = 0; i < LINEUPS; i++) {
            const l : LineupI = {
                avatarList: [1001],
                extraLineupType: ExtraLineupType.LINEUP_NONE,
                index: i,
                isVirtual: false,
                leaderSlot: 0,
                mp: 100,
                name: `Team ${i}`,
                planeId: 10001
            };
            dataObj.lineup.lineups[i] = l;
        }

        const player = new Player(session, dataObj);
        await Avatar.addAvatarToPlayer(player, 1001);

        // Save to database and return.
        await db.set("players", dataObj);
        return player;
    }

    public async save() {
        const db = Database.getInstance();
        c.debug(JSON.stringify(this.db, null, 2));
        await db.update("players", { _id: this.db._id }, this.db);
    }
}