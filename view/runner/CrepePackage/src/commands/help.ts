import Logger from "../util/Logger";
import { Command } from "./Interface";
import fs from 'fs';
const c = new Logger("/help", "blue");

export default async function handle(command: Command) {
    const cmds = fs.readdirSync(__dirname);
    c.log(`${cmds.length} commands available:`)

    cmds.forEach(cmd => {
        if (cmd.endsWith(".ts")) {
            const cmdName = cmd.replace(/.ts/gm, "");
            if (cmdName !== "Interface") c.trail(cmdName);
        }
    })
}