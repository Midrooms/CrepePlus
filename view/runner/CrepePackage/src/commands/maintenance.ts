import Config from "../util/Config";
import Logger, { VerboseLevel } from "../util/Logger";
import { Command } from "./Interface";
const c = new Logger("/maintenance", "blue");

export default async function handle(command: Command) {
    switch (command.args[0]) {
        case "on":
            Config.GAMESERVER.MAINTENANCE = true;
            if (command.args[1]) Config.GAMESERVER.MAINTENANCE_MSG = command.args.slice(1).join(" ");
            c.log("Maintenance mode enabled.");
            break;
        case "off":
            Config.GAMESERVER.MAINTENANCE = false;
            c.log("Maintenance mode disabled.");
            break;
        default:
            c.log(`Maintenance mode is ${Config.GAMESERVER.MAINTENANCE ? "enabled" : "disabled"}`);
            c.log(`Maintenance message: ${Config.GAMESERVER.MAINTENANCE_MSG}`);
            c.log("Usage: /maintenance [on|off] [message]");
            break;
    }
}