import Logger from "../util/Logger";
import Interface, { Command } from "./Interface";
const c = new Logger("/sync", "blue");

export default async function handle(command: Command) {
    if (!Interface.target) {
        c.log("No target specified");
        return;
    }

    Interface.target.sync();

    c.log(`Synced ${Interface.target.account.name}`);
}