import { createInterface } from 'readline';
import _alias from './alias.json';
import Logger from '../util/Logger';
import Session from '../server/kcp/Session';

const c = new Logger("Command", "blue");
const alias: { [key: string]: string } = _alias;

export class Command {
    public readonly name: string;
    public readonly args: string[];

    public constructor(public readonly full: string) {
        const split = full.split(" ");
        this.name = split[0];
        this.args = split.slice(1);
    }
}

export default class Interface {
    public static readonly rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    public static target?: Session;

    private constructor() { }

    public static start() {
        Interface.rl.question("", (_command) => {
            if (!_command) {
                Interface.start();
                return;
            }
            const cmd = new Command(_command);
            Interface.handle(cmd);
            Interface.start();
        });

        Interface.rl.on('close', () => {
            console.log('Have a great day!');
            process.exit(0);
        });
    }

    public static handle(cmd: Command) {
        import(`./${alias[cmd.name] || cmd.name}`).then(async module => {
            await module.default(cmd);
        }).catch(err => {
            if (err.code == "MODULE_NOT_FOUND") {
                c.log(`Command ${cmd.name} not found.`);
                return;
            }
            c.error(err);
        });
    }
}