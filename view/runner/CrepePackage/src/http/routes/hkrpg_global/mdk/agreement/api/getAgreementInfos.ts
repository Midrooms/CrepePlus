import { Request, Response } from "express";

export default function handle(req: Request, res: Response) {
    res.send({
        retcode: 0,
        message: "OK",
        data: {
            marketing_agreements: []
        }
    });
}