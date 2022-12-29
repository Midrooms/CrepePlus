import { Request, Response } from "express";
import Logger from "../../../util/Logger";
const c = new Logger("dataUpload", "green");

export default function handle(req: Request, res: Response) {
    res.send({ code: 0 });
}