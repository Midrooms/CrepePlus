import Avatar from "../db/Avatar";
import AvatarExcelTable from "../data/excel/AvatarExcelTable.json";
import Logger from "../util/Logger";
import Interface, { Command } from "./Interface";
const c = new Logger("/avatar", "blue");

export default async function handle(command: Command) {
    if (!Interface.target) {
        c.log("No target specified");
        return;
    }

    const actionType = command.args[0];
    const avatarId = Number(command.args[1]);
    const uid = Interface.target.player.db._id;
    const player = Interface.target.player;

    switch (actionType) {
        default: {
            c.log(`Usage: /avatar <add|remove|giveall|removeall> <avatarId>`);
            break;
        }
        case "add": {
            if (!avatarId) {
                return c.log("No avatarId specified");
            }

            // Check if it already exists
            if (await Avatar.hasAvatar(player, avatarId)) {
                return c.log(`Avatar ${avatarId} already exists`);
            }

            await Avatar.addAvatarToPlayer(player, avatarId).then(a => c.log(`Avatar ${avatarId} added to ${a.db.ownerUid}`));
            break;
        }
        case "remove": {
            if (!avatarId) return c.log("No avatarId specified");
            await Avatar.removeAvatarFromPlayer(player, avatarId).then(() => c.log(`Avatar ${avatarId} removed from ${uid}`));
            break;
        }
        case "giveall": {
            for (const id in AvatarExcelTable) {
                const avatarId = Number(id);
                // Let's not brick our account.
                if (avatarId>= 8000) {
                    continue;
                }

                await Avatar.addAvatarToPlayer(player, avatarId);
            }
            c.log(`All avatars added to ${uid}`);
            break;
        }
        case "removeall": {
            for (const id in AvatarExcelTable) {
                if (Number(id) !== 1001) {
                    await Avatar.removeAvatarFromPlayer(player, parseInt(id));
                }
            }
            c.log(`All avatars removed from ${uid}`);
            break;
        }
    }

    Interface.target.sync();
}
