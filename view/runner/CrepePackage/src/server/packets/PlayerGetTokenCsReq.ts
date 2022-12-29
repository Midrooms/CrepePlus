import Logger from "../../util/Logger";
import Account from "../../db/Account";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";
import Player from "../../db/Player";
import { PlayerGetTokenScRsp } from "../../data/proto/StarRail";
const c = new Logger("Dispatch");

interface PlayerGetTokenCsReq {
    channel_id?: number;
    account_uid?: string;
    token?: string;
    uid?: number;
    device?: string;
}

const retWarn = (msg: string) => c.warn(msg);

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as PlayerGetTokenCsReq;
    const dataObj = {
        retcode: 0,
        secretKeySeed: 0,
    } as PlayerGetTokenScRsp;

    try {
        const account = await Account.fromToken(body.token || "");
        if (!account) retWarn(`Account not found with token ${body.token}`);

        const player = await Player.fromToken(session, account?.token || "");
        if (!player) retWarn(`Player not found with accountToken ${account?.token}`);
        if (!player || !account) {
            dataObj.retcode = 6;
            dataObj.msg = "Player not found";
            return;
        }

        session.account = account;
        session.player = player;
        dataObj.uid = player.db._id;

        if (player.db.banned) {
            dataObj.retcode = 1013;
            dataObj.blackInfo = {
                banType: 2,
                beginTime: Math.floor(Date.now() / 1000),
                endTime: Math.floor(Date.now() / 1000) + 86400,
                limitLevel: 0,
            }
        }

        if (player.db.token !== body.token) {
            retWarn(`Token invalid (${session.ctx.address}:${session.ctx.port})`);
            dataObj.retcode = 1005;
            dataObj.msg = "Token invalid";
        }
    } catch (e) {
        dataObj.retcode = 2;
        c.error(e as Error);
    } finally {
        session.send(PlayerGetTokenScRsp, dataObj);
    }

}