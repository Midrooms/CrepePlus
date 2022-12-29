import { Request, Response } from "express";
import Logger, { VerboseLevel } from "../../../util/Logger";
const c = new Logger("dataUpload", "green");

export default function handle(req: Request, res: Response) {
    try {
        const content = req.body[0].uploadContent;
        if (content.LogStr) {
            c.warn(content.LogStr);
            if (Logger.VERBOSE_LEVEL == VerboseLevel.ALL) c.trail(content.StackTrace);
        }
    } catch { }
    res.send({ code: 0 });
}