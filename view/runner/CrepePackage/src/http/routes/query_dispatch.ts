import { Request, Response } from "express";
import Config from "../../util/Config";

interface Region {
    dispatch_url: string;
    env_type: string;
    name: string;
    title: string;
}

export default function handle(req: Request, res: Response) {
    const dataObj = {
        region_list: [] as Region[],
        retcode: 0
    }

    Config.DISPATCH.forEach(item => {
        dataObj.region_list.push({
            dispatch_url: item.DISPATCH_URL,
            env_type: "2",
            name: item.DISPATCH_NAME,
            title: "CrepeSR"
        });
    });

    res.send(dataObj);
}