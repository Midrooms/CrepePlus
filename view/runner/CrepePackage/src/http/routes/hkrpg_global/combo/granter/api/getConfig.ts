import { Request, Response } from "express";

export default function handle(req: Request, res: Response) {
    res.send({
        retcode: 0,
        message: "OK",
        data: {
            protocol: true,
            qr_enabled: true,
            log_level: "INFO",
            announce_url: "https://sdk.hoyoverse.com/hkrpg/announcement/index.html?sdk_presentation_style=fullscreen\u0026sdk_screen_transparent=true\u0026auth_appid=announcement\u0026authkey_ver=1\u0026sign_type=2#/",
            push_alias_type: 0,
            disable_ysdk_guard: true,
            enable_announce_pic_popup: true
        }
    });
}