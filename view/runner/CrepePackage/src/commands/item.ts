import { Equipment } from "../data/proto/StarRail";
import Player from "../db/Player";
import ItemExcel from "../util/excel/ItemExcel";
import Logger from "../util/Logger";
import Interface, { Command } from "./Interface";
const c = new Logger("/item", "blue");

export default async function handle(command: Command) {
    if (!Interface.target) {
        c.log("No target specified");
        return;
    }

    const player = Interface.target.player;
    const actionType = command.args[0];
    const itemId = Number(command.args[1]);

    let count: number = 1;
    let level: number = 1;
    let rank: number = 0;
    let promotion: number = 0;

    for (let i = 2; i < command.args.length; i++) {
        const arg = command.args[i];
        const number = Number(command.args[i].substring(1));

        if (arg.startsWith("x")) {
            count = number;
        }
        else if (arg.startsWith("l")) {
            level = number;
        }
        else if (arg.startsWith("r")) {
            rank = number;
        }
        else if (arg.startsWith("p")) {
            promotion = number;
        }
    }

    switch (actionType) {
        case "give": {
            await handleGive(player, itemId, count, level, rank, promotion);
            break;
        }
        case "giveall": {
            await handleGiveAll(player);
            break;
        }
        default: {
            c.log(`Usage: /item <give|giveall> <itemId> [x<count>|l<level>|r<rank>|p<promotion>]*`);
            break;
        }
    }

    // Sync session.
    await player.session.sync();
}

async function handleGive(player: Player, itemId: number, count:number, level: number, rank: number, promotion: number) {
    if (!itemId) {
        return c.log("No avatarId specified");
    }

    // Check if this item exists.
    const itemData = ItemExcel.fromId(itemId);
    if (!itemData) {
        return c.log(`Item ID ${itemId} does not exist.`);
    }

    const inventory = await player.getInventory();
    switch (itemData.ItemType) {
        case "Material":
            await inventory.addMaterial(itemId, count);
            break;
        case "Equipment":
            for (let i = 0; i < count; i++) {
                await inventory.addEquipment({
                    tid: itemId,
                    uniqueId: 0,
                    level: level,
                    rank: rank,
                    exp: 1,
                    isProtected: false,
                    promotion: promotion,
                    baseAvatarId: 0
                } as Equipment);
            }
            break;
        default:
            return c.log(`Unsupported item type: ${itemData.ItemType}.`);
            break;
    }

    c.log(`Added ${count} of item ${itemId} to player ${player.uid}`);
}

async function handleGiveAll(player: Player) {
    const inventory = await player.getInventory();

    for (const entry of ItemExcel.all()) {
        const count = 
            (entry.ItemType == "Material") ? 1000 : 
            (entry.ItemType == "Virtual") ? 10_000_000 : 
            1;
        await inventory.addItem(entry.ID, count);
    }
    
    c.log(`All materials added to ${player.uid}`);
}