import { Request, Response } from "express";

export default function handle(req: Request, res: Response) {
    res.send({
        retcode: 0,
        message: "OK",
        data: {
            id: 24,
            game_key: "hkrpg_global",
            client: "PC",
            identity: "I_IDENTITY",
            guest: false,
            ignore_versions: "",
            scene: "S_NORMAL",
            name: "崩坏RPG",
            disable_regist: true,
            enable_email_captcha: false,
            thirdparty: [],
            disable_mmt: false,
            server_guest: true,
            thirdparty_ignore: {
                fb: "",
                tw: ""
            },
            enable_ps_bind_account: false,
            thirdparty_login_configs: {}
        }
    });
}