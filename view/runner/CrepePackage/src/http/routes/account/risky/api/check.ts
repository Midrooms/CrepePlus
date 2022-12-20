import { Request, Response } from "express";

// Example request:
// {
//     "action_type": "login",
//     "api_name": "/shield/api/login",
//     "username": "test"
// }

export default function handle(req: Request, res: Response) {
    // Test handler
    res.send({
        retcode: 0,
        message: "OK",
        data: {
            id: "",
            action: "ACTION_NONE",
            geetest: null
        }
    });
}