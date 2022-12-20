import { Request, Response } from "express";
import protobuf, { Type } from 'protobufjs';
import { resolve } from 'path';
import Config from "../../util/Config";
import { Gateserver } from "../../data/proto/StarRail";

export default function handle(req: Request, res: Response) {
    const dataObj = Gateserver.fromPartial({
        retcode: 0,
        msg: "OK",
        regionName: "CrepeSR",
        ip: Config.GAMESERVER.SERVER_IP,
        port: Config.GAMESERVER.SERVER_PORT,
        serverDescription: "This is not BingusRail",
        exResourceUrl: "https://localhost/asb/design",
        dataUseAssetBoundle: false,
        resUseAssetBoundle: false,
        assetBundleUrl: "https://localhost/asb",
    } as Gateserver);

    if (Config.GAMESERVER.MAINTENANCE) {
        dataObj.retcode = 2;
        dataObj.msg = Config.GAMESERVER.MAINTENANCE_MSG;
        dataObj.stopBeginTime = Date.now();
        dataObj.stopEndTime = Date.now() * 2;
    }

    let rsp;
    try {
        rsp = Gateserver.encode(dataObj).finish();
    } catch {
        rsp = Gateserver.encode(Gateserver.fromPartial({
            retcode: 2,
            msg: "Internal server error",
            stopBeginTime: Date.now(),
            stopEndTime: Date.now() * 2,
        })).finish();
    }
    res.send(Buffer.from(rsp).toString('base64'));
}