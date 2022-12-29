import Logger from "../util/Logger";
import Database from "./Database";
const c = new Logger("Account");

interface AccountI {
    uid: string | number;
    name: string;
    token: string;
}

export default class Account {
    private constructor(public readonly uid: string | number, public readonly name: string, public readonly token: string) {

    }

    public static async fromUID(uid: string | number): Promise<Account | undefined> {
        const db = Database.getInstance();
        const account = await db.get("accounts", { _id: Number(uid) });
        if (!account) return;
        return new Account(Number(account._id.toString()), account.name, account.token);
    }

    public static async fromToken(token: string): Promise<Account | undefined> {
        const db = Database.getInstance();
        const account = await db.get("accounts", { token });
        if (!account) return;
        return new Account(Number(account._id.toString()), account.name, account.token);
    }

    public static async fromUsername(name: string): Promise<Account | undefined> {
        const db = Database.getInstance();
        const account = await db.get("accounts", { name });
        if (!account) return;
        return new Account(Number(account._id.toString()), account.name, account.token);
    }

    public static async create(name: string, uid?: string | number): Promise<Account> {
        const db = Database.getInstance();
        let selfAssignedUID = true;
        if (!uid) {
            uid = Math.round(Math.random() * 50000);
            selfAssignedUID = false;
        }

        const account = await db.get("accounts", { uid });
        if (account) {
            if (!selfAssignedUID) {
                return await Account.create(name, uid);
            } else {
                throw new Error(`Account with uid ${uid} already exists.`);
            }
        }

        const token = generateToken();
        await db.set("accounts", { _id: Number(uid), name, token });
        return new Account(Number(uid), name, token);
    }

    public static async delete(uid: string | number): Promise<void> {
        const db = Database.getInstance();
        const account = await Account.fromUID(uid);
        if (!account) {
            throw new Error(`Account with uid ${uid} does not exist.`);
        }
        await db.delete("accounts", { _id: Number(uid) });
    }

    public async save() {
        const db = Database.getInstance();
        await db.update("accounts", { _id: Number(this.uid) }, this);
    }
}

function generateToken(): string {
    let token = "";
    for (let i = 0; i < 16; i++) {
        token += Math.random().toString(36).substring(2, 15)
    }
    return token;
}