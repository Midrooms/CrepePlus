import Logger from "../util/Logger";
import { Command } from "./Interface";
const c = new Logger("/exit", "blue");

export default async function handle(command: Command) {
    c.log("Good riddance!");
    process.exit(0);
}