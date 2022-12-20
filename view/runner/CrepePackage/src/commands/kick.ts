import Logger from "../util/Logger";
import Interface, { Command } from "./Interface";
const c = new Logger("/kick", "blue");

export default async function handle(command: Command) {
    if (!Interface.target) {
        c.log("No target specified");
        return;
    }

    Interface.target.kick();

    c.log(`Kicked ${Interface.target.account.name}`);
}