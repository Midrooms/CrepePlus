import { Request, Response } from "express";
import Account from "../../../../../../db/Account";
import Logger from "../../../../../../util/Logger";
const c = new Logger("Dispatch");
// Example request:
// {"uid":"63884253","token":"ZQmgMdXA1StL9A3aPBUedr8yoiuoLrmV"}

export default async function handle(req: Request, res: Response) {
    const acc = await Account.fromUID(req.body.uid);
    const dataObj: any = {
        retcode: 0,
        message: "OK",
        data: {
            account: {}
        }
    }
    if (!acc) {
        dataObj.retcode = -202;
        dataObj.message = "Account not found";
        res.send(dataObj);
        c.warn(`Player ${req.body.uid} not found (${req.ip})`);
    } else {
        if (acc.token === req.body.token) {
            dataObj.data.account = acc;
            c.log(`Player ${req.body.uid} logged in (${req.ip})`);
            res.send(dataObj);
        } else {
            dataObj.retcode = -202;
            dataObj.message = "Invalid token";
            res.send(dataObj);
        }
    }

}