import { Request, Response } from "express";

export default function handle(req: Request, res: Response) {
    res.send({
        data: null,
        message: "RetCode_NoConfig",
        retcode: 7
    });
}