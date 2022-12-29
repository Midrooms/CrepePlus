import { Request, Response } from "express";

export default function handle(req: Request, res: Response) {
    // Test handler
    res.send({
        retcode: -1,
        message: "Invalid endpoint"
    });
}