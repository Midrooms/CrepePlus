import SRServer from "../server/kcp/SRServer";
import Logger from "../util/Logger";
import { Command } from "./Interface";
const c = new Logger("/kickall", "blue");

export default async function handle(command: Command) {
    const hard = command.args[0];

    for (const [key, session] of SRServer.getInstance().sessions) {
        session.kick(!!hard);
    }

    c.log(`Kicked all players. Hard kick: ${!!hard}`);
}