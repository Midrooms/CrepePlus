import { Request, Response } from "express";

export default function handle(req: Request, res: Response) {
    const data = JSON.parse(req.body.data)

    res.send({
        retcode: 0,
        message: "OK",
        data: {
            combo_id: 1,
            open_id: data.uid,
            combo_token: data.token,
            data: {
                guest: data.guest
            },
            heartbeat: false,
            account_type: 1,
            fatigue_remind: null
        }
    });
}