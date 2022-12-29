import Logger from "../util/Logger";
import Interface, { Command } from "./Interface";
const c = new Logger("/pos", "blue");

export default async function handle(command: Command) {
    if (!Interface.target) {
        c.log("No target specified");
        return;
    }

    const pos = Interface.target.player.db.posData.pos;
    c.log(`Current position: x=${pos.x}, y=${pos.y}, z=${pos.z}.`);
}