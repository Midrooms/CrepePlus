import { Request, Response } from "express";
import Account from "../../../../../../db/Account";
import Config from "../../../../../../util/Config";
import Logger from "../../../../../../util/Logger";
const c = new Logger("Dispatch");

// Example request:
// {
//     account: "test",
//     (RSA)password: "BKWPZjqKfKr6ZKuO40ONwV5JxOi4dg71aeBcxPVK/U+8FM8d5kc5EjLdEXyn6McBvUOL67CmT89eo9jrdwp9xpFexA/C1d9BCxen0NQ+zCrQUkSc6AFD9PYkAmdTNnila5L15SrveQQRtbsDwZeZ9owVH7kyoXuDGUOOA6dc4qE=",
//     is_crypto: true
// }

export default async function handle(req: Request, res: Response) {
    const acc = await Account.fromUsername(req.body.account);
    const dataObj: any = {
        retcode: 0,
        message: "OK",
        data: {
            account: {}
        }
    }
    if (!acc) {
        if (Config.AUTO_ACCOUNT) {
            const account = await Account.create(req.body.account);
            c.log(`Account ${account.name} with UID ${account.uid} auto-created.`);
            dataObj.data.account = account;
            res.send(dataObj);
            return;
        }

        dataObj.retcode = -202;
        dataObj.message = "Account not found";
        c.warn(`Player ${req.body.account} not found (${req.ip})`);
        res.send(dataObj);
    } else {
        dataObj.data.account = acc;
        c.log(`Player ${req.body.account} logged in (${req.ip})`);
        res.send(dataObj);
    }
}