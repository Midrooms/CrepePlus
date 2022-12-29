// @ts-ignore
import { RCONServer as RServer } from "rcon-server";
import { Writable } from "stream";
import Interface, { Command } from "../../commands/Interface";
import Config from "../../util/Config";
import Logger from "../../util/Logger";
const c = new Logger("RCON", "green");

export default class RCONServer {
    private static _instance: RCONServer;
    public RCON!: RServer;

    private constructor() { }

    public static getInstance(): RCONServer {
        if (!this._instance) this._instance = new RCONServer();
        return this._instance;
    }

    public start() {
        if (!Config.RCON.RCON_ENABLED) return;
        this.RCON = new RServer({
            host: Config.HTTP.HTTP_HOST,
            clientLimit: Config.RCON.RCON_CLIENT_LIMIT,
            destroySocketOnLimitExceeded: false,
            emitAdvancedEvents: false,
            password: Config.RCON.RCON_PASSWORD,
            port: Config.RCON.RCON_PORT
        });

        this.RCON.on("listening", () => {
            c.log(`Listening on ${Config.RCON.RCON_PORT}`);
        });

        this.RCON.on("commandRequest", (cmd: {
            size: number,
            id: number,
            type: number,
            body: string
            resolve: (value: string) => void,
        }) => {
            c.verbL(cmd);
            Interface.handle(new Command(cmd.body));
            cmd.resolve(`Command executed.`);
        });

        this.RCON.on("login", ({ pw, fail }: { pw: string, fail: boolean }) => {
            c.debug(pw);
            fail ? c.log(`Login failed`) : c.log(`Login successful`); // For some reason succ is flipped
        });

        this.RCON.connect();
    }
}