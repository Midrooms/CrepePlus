import { AvatarType, ExtraLineupType, HeroBasicType, PlayerBasicInfo, PlayerLoginCsReq, PlayerLoginScRsp } from "../../data/proto/StarRail";
import Avatar from "../../db/Avatar";
import Player from "../../db/Player";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

// { Example body:
//     platform: 3,
//     deviceUuid: '406d064a8fa3bcb32f1d88df28e600e5a86bbf751658757874371',
//     deviceInfo: '{"operatingSystem":"Windows 10  (10.0.19043) 64bit","deviceModel":"B450M DS3H V2 (Gigabyte Technology Co., Ltd.)","graphicsDeviceName":"NVIDIA GeForce GTX 1650","graphicsDeviceType":"Direct3D11","graphicsDeviceVendor":"NVIDIA","graphicsDeviceVersion":"Direct3D 11.0 [level 11.1]","graphicsMemorySize":3962,"processorCount":12,"processorFrequency":3394,"processorType":"AMD Ryzen 5 2600 Six-Core Processor ","systemMemorySize":16335,"DeviceSoC":""}',
//     systemInfo: 'Windows 10  (10.0.19043) 64bit',
//     clientVersion: 'OSCBWin0.70.0',
//     language: 3,
//     checkSum_1: 'ff07bc743a394e0ff1c163edc663137d',
//     checkSum_2: 'ca590da88620492b921c9b3b4977f1be10',
//     resolution: '1920*1080',
//     systemLanguage: 'Dutch',
//     resVersion: 611127,
//     clientTimeZone: '01:00:00'
// }

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as PlayerLoginCsReq;

    const plr = await Player.fromUID(session, session.player.db._id);
    if (!plr) return;

    if (!plr.db.heroBasicType) {
        plr.db.heroBasicType = HeroBasicType.BoyWarrior;
        plr.save();
    }

    if (!plr.db.basicInfo) {
        plr.db.basicInfo = {
            exp: 0,
            level: 1,
            hcoin: 0,
            mcoin: 0,
            nickname: plr!.db.name,
            scoin: 0,
            stamina: 100,
            worldLevel: 1,
        }
        plr.save();
    }

    if (!plr.db.lineup) {
        await Avatar.addAvatarToPlayer(plr, 1001);
        //await Avatar.create(plr.db._id, 1001, 0);
        const baseLineup = {
            avatarList: [1001],
            extraLineupType: ExtraLineupType.LINEUP_NONE,
            index: 0,
            isVirtual: false,
            leaderSlot: 0,
            mp: 100, // ?? Not sure what this is
            name: "",
            planeId: 10001
        }
        const LINEUPS = 6;
        plr.db.lineup = {
            curIndex: 0,
            lineups: {}
        }
        for (let i = 0; i <= LINEUPS; i++) {
            let copy = baseLineup;
            copy.name = `Team ${i}`;
            plr.db.lineup.lineups[i] = baseLineup;
        }
        plr.save();
    }

    if (!plr.db.posData) {
        plr.db.posData = {
            floorID: 10001001,
            planeID: 10001,
            pos: {
                x: 0,
                y: 439,
                z: -45507
            }
        }
        plr.save();
    }

    session.send(PlayerLoginScRsp, {
        basicInfo: plr!.db.basicInfo as PlayerBasicInfo,
        isNewPlayer: false,
        stamina: 100,
        retcode: 0,
        isRelay: false,
        loginRandom: Number(body.loginRandom),
        serverTimestampMs: Math.round(new Date().getTime() / 1000),
    } as PlayerLoginScRsp);
}