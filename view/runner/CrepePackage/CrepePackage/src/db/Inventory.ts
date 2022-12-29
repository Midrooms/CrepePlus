import { Equipment, Item, Material, PlayerSyncScNotify, Relic } from "../data/proto/StarRail";
import Logger from "../util/Logger";
import Database from "./Database";
import Player from "./Player";
import ItemExcel from "../util/excel/ItemExcel";

const c = new Logger("Inventory");

export interface PayItemData { 
    id: number,
    count: number 
}

interface InventoryI {
    _id: number,
    nextItemUid: number,
    materials: { [key: number]: number },
    relics: Relic[],
    equipments: Equipment[]
}

export default class Inventory {
    public readonly player : Player;
    public readonly db: InventoryI;

    private constructor(player: Player, db: InventoryI) {
        this.player = player;
        this.db = db;
    }

    public static async loadOrCreate(player: Player) : Promise<Inventory> {
        // Try to load the player's inventory from the database.
        const db = Database.getInstance();
        const inventory = await db.get("inventory", { _id: player.uid }) as unknown as InventoryI; // How to get rid of this ugly fuck?!

        // If successfull, we are done.
        if (inventory) {
            return new Inventory(player, inventory);
        }

        // Otherwise, we create a default inventory.
        const data : InventoryI = {
            _id: player.uid,
            nextItemUid: 1,
            materials: {},
            relics: [],
            equipments: []
        };
        await db.set("inventory", data);
        return new Inventory(player, data);
    }

    public async save() {
        const db = Database.getInstance();
        await db.update("inventory", { _id: this.db._id }, this.db);
    }

    /********************************************************************************
        Get inventory info.
    ********************************************************************************/
   /**
    * Get list of all `Material`s as proto.
    * @returns List of materials.
    */
    public getMaterialList() : Material[] {
        const res: Material[] = [];

        Object.keys(this.db.materials).forEach(key => {
            res.push({ tid: Number(key), num: this.db.materials[Number(key)] } as Material);
        });

        return res;
    }

    /**
     * Get list of all `Equipment`s as proto.
     * @returns List of equipments.
     */
    public getEquipmentList() : Equipment[] {
        return this.db.equipments;
    }

    /**
     * Get list of all `Relic`s as proto.
     * @returns List of relics.
     */
    public getRelicsList() : Relic[] {
        return this.db.relics;
    }

    /**
     * Returns the count of the given item (material or virtual) in the player's inventory.
     * @param id The item id.
     * @returns The count in the player's inventory.
     */
    public async getItemCount(id: number) : Promise<number> {
        // Get item data.
        const itemData = ItemExcel.fromId(id);
        if (!itemData) {
            return 0;
        }

        switch (itemData.ItemType) {
            case "Virtual": return this.getVirtualItemCount(id);
            case "Material": return this.db.materials[id] ?? 0;
        }

        return 0;
    }

    private getVirtualItemCount(id: number) : number {
        // ToDo: Figure out which virtual item ID is what.
        switch (id) {
            case 2:
                return this.player.db.basicInfo.scoin;
                break;
        }

        return 0;
    }

    /**
     * Fetch the equipment with the given unique ID from the player's inventory.
     * @param uniqueId The unique ID of the equipment to fetch.
     * @returns The `Equipment` with the given unique ID, or `undefined` if the player does not have that equipment.
     */
    public getEquipmentByUid(uniqueId: number) {
        return this.db.equipments.filter(e => e.uniqueId == uniqueId)?.[0];
    }

    /********************************************************************************
        Add items to the inventory.
    ********************************************************************************/

    /**
     * Add the given amount of the given item to the player's inventory. 
     * @param id The item id. For equipment and relics, this is the base id.
     * @param count The amount of items to add.
     */
    public async addItem(id: number, count: number) {
        // Get info for the particular item we are trying to add.
        const itemData = ItemExcel.fromId(id);
        if (!itemData) {
            return;
        }

        // Handle adding depending on item type.
        const t = itemData.ItemType;
        if (t == "Virtual") {
            await this.addVirtualItem(id, count);
        }
        else if (t == "Material") {
            await this.addMaterial(id, count);
        }
        else if (t == "Equipment") {
            for (let i = 0; i < count; i++) {
                await this.addEquipment(id);
            }
        }
        else if (t == "Relic") {
            for (let i = 0; i < count; i++) {
                await this.addRelic(id);
            }
        }
    }

    /**
     * Adds the given amount of the virtual item with the given id to the player's inventory.
     * @param id The item id.
     * @param count The amount.
     */
    public async addVirtualItem(id: number, count: number) {
        // ToDo: Figure out which virtual item ID is what.
        switch (id) {
            case 2:
                this.player.db.basicInfo.scoin += count;
                break;
        }

        // Save.
        this.player.save();
    }

    /**
     * Adds the given amount of the material with the given id to the player's inventory.
     * @param id The material id.
     * @param count The amount.
     */
    public async addMaterial(id: number, count: number) {
        // Get info for the particular item we are trying to add.
        const itemData = ItemExcel.fromId(id);
        if (!itemData || itemData.ItemType != "Material") {
            return;
        }

        // Get current item count for this ID and calculate new count.
        const currentCount = this.db.materials[id] ?? 0;
        const newCount = Math.min(currentCount + count, itemData.PileLimit);

        // Update.
        this.db.materials[id] = newCount;
        await this.save();

        // Send update.
        this.sendMaterialUpdate();
    }

    /**
     * Adds the given equipment to the player's inventory.
     * @param equipment Either an `Equipment`, or the base id.
     */
    public async addEquipment(equipment: number | Equipment) {
        // If the parameter is a number, add a new equipment with this item ID as base.
        if (typeof(equipment) == "number") {
            // Sanity check.
            if (ItemExcel.fromId(equipment)?.ItemType != "Equipment") {
                return;
            }

            const equip : Equipment = {
                tid: equipment,
                uniqueId: this.db.nextItemUid++,
                level: 1,
                rank: 1,
                exp: 1,
                isProtected: false,
                promotion: 1,
                baseAvatarId: 0
            };

            this.db.equipments.push(equip);
            await this.save();
            return;
        }

        // Otherwise, add the equipment object directly, but reset it's UID.
        equipment.uniqueId = this.db.nextItemUid++;
        this.db.equipments.push(equipment);
        await this.save();

        // Send update.
        this.sendEquipmentUpdate();
    }

    /**
     * Adds the given relic to the player's inventory.
     * @param relic Either a `Relic`, or the base id.
     */
    public async addRelic(relic: number | Relic) {
        // Don't add relics for now until we figure out affix IDs, since the game kinda breaks with
        // incorrect ones.
        return;

        // If the parameter is a number, add a new equipment with this item ID as base.
        /*if (typeof(relic) == "number") {
            const rel : Relic = {
                tid: relic,
                uniqueId: this.db.nextItemUid++,
                level: 1,
                exp: 1,
                isProtected: false,
                baseAvatarId: 0,
                mainAffixId: 1,
                subAffixList: []
            };

            this.db.relics.push(rel);
            return;
        }

        // Otherwise, add the equipment object directly, but reset it's UID.
        relic.uniqueId = this.db.nextItemUid++;
        this.db.relics.push(relic);*/
    }

    /********************************************************************************
        Remove items from the inventory directly.
    ********************************************************************************/

   /**
    * Removes the the given number of the given item (virtual or material) with the given ID.
    * @param id The item ID.
    * @param count The number to remove.
    */
    public async removeItem(id: number, count: number) {
        const itemData = ItemExcel.fromId(id);
        if (!itemData) {
                return ;
        }

        switch (itemData.ItemType) {
            case "Virtual": await this.removeVirtualItem(id, count); break;
            case "Material": await this.removeMaterial(id, count); break;
        }
    }

    /**
     * Removes the given amount of the given virtual item from the player's inventory.
     * @param id The item id.
     * @param count The amount.
     */
    public async removeVirtualItem(id: number, count: number) {
        await this.addVirtualItem(id, -count);
    }

    /**
     * Removes the given amount of the given material from the player's inventory.
     * @param id The item id.
     * @param count The amount.
     */
    public async removeMaterial(id: number, count: number) {
        await this.addMaterial(id, -count);
    }

    /**
     * Removes the given equipment player's inventory.
     * @param equipment Either an `Equipment`, or the equipment's unique id.
     */
    public async removeEquipment(equipment: number | Equipment) {
        // Find index to delete.
        const toDelete: number = (typeof(equipment) == "number") ? equipment : equipment.uniqueId;
        const index = this.db.equipments.findIndex(i => i.uniqueId == toDelete);
        if (index == -1) {
            return;
        }

        // Delete and save.
        this.db.equipments.splice(index, 1);
        this.save();

        // Send update.
        this.sendEquipmentUpdate();
    }

    /**
     * Removes the given relic player's inventory.
     * @param relic Either a `Relic`, or the relic's unique id.
     */
    public async removeRelic(relic: number | Relic) {
        // Find index to delete.
        const toDelete: number = (typeof(relic) == "number") ? relic : relic.uniqueId;
        const index = this.db.relics.findIndex(i => i.uniqueId == toDelete);
        if (index == -1) {
            return;
        }

        // Delete and save.
        this.db.relics.splice(index, 1);
        this.save();

        // Send update.
        this.sendRelicUpdate()
    }

    /********************************************************************************
        Pay items.
    ********************************************************************************/

   /**
    * Pay items (virtual items and materials).
    * @param items The items to be paid.
    * @returns True if paying succeeded, false otherwise.
    */
    public async payItems(items: PayItemData[]) : Promise<boolean> {
        // Check if the player has a sufficient amount of all necessary items.
        for (const item of items) {
            const currentCount = await this.getItemCount(item.id);
            if (currentCount < item.count) {
                return false;
            }
        }

        // We have enough of everything - pay.
        for (const item of items) {
            await this.removeItem(item.id, item.count);
        }

        // Send update.
        this.sendMaterialUpdate();

        // Done.
        return true;
    }

    /********************************************************************************
        Player updating.
    ********************************************************************************/
   /**
    * Send `PlayerSyncScNotify` for materials.
    */
    public sendMaterialUpdate() {
        this.player.session.send(PlayerSyncScNotify, PlayerSyncScNotify.fromPartial({
            materialList: this.getMaterialList()
        }));
    }

    /**
    * Send `PlayerSyncScNotify` for equipments.
    */
    public sendEquipmentUpdate() {
        this.player.session.send(PlayerSyncScNotify, PlayerSyncScNotify.fromPartial({
            equipmentList: this.getEquipmentList()
        }));
    }

    /**
    * Send `PlayerSyncScNotify` for relics.
    */
    public sendRelicUpdate() {
        this.player.session.send(PlayerSyncScNotify, PlayerSyncScNotify.fromPartial({
            relicList: this.getRelicsList()
        }));
    }
}