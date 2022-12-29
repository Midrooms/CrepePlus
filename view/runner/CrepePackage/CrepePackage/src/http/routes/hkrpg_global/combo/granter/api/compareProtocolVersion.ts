import { Request, Response } from "express";

export default function handle(req: Request, res: Response) {
    // Test handler
    res.send({
        retcode: 0,
        message: "OK",
        data: {
            modified: true,
            protocol: {
                id: 0,
                app_id: 11,
                language: "en",
                user_proto: "",
                priv_proto: "",
                major: 1,
                minimum: 2,
                create_time: "0",
                teenager_proto: "",
                third_proto: ""
            }
        }
    });
}