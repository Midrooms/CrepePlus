import Account from "../db/Account";
import Logger from "../util/Logger";
import { Command } from "./Interface";
const c = new Logger("/account", "blue");

export default async function handle(command: Command) {
    switch (command.args[0]) {
        case "create":
            if (!command.args[1]) {
                c.log(`Usage: account create <name> [uid]`);
                return;
            }
            try {
                const acc = await Account.create(command.args[1], command.args[2]);
                c.log(`Account ${acc.name} with UID ${acc.uid} created.`);
            } catch (e) {
                c.error(e as Error);
            }
            break;
        case "delete":
            if (!command.args[1]) {
                c.log(`Usage: account delete <uid>`);
                return;
            }
            const acc = await Account.fromUID(command.args[1]);
            if (!acc) {
                c.error(`Account with UID ${command.args[1]} does not exist.`);
                return;
            }
            Account.delete(command.args[1]);
            c.log(`Account ${acc.name} with UID ${acc.uid} deleted successfully.`);
            break;
        default:
            c.log(`Usage: account create <name> [uid]`);
            c.log(`Usage: account delete <uid>`);
    }
}