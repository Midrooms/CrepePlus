import fs from 'fs';
import { resolve } from 'path';
import { VerboseLevel } from './Logger';

const DEFAULT_CONFIG = {
    // General
    VERBOSE_LEVEL: 1,

    // MongoDB
    MONGO_URI: "mongodb://0.0.0.0:27017/crepesr",

    // HTTP
    HTTP: {
        HTTP_HOST: "0.0.0.0",
        HTTP_PORT: 443
    },

    // Dispatch
    DISPATCH: [{
        DISPATCH_NAME: "CrepeSR",
        DISPATCH_URL: "http://localhost/query_gateway"
    }],

    // GameServer
    GAMESERVER: {
        SERVER_IP: "127.0.0.1",
        SERVER_PORT: 22102,
        MAINTENANCE: false,
        MAINTENANCE_MSG: "Server is in maintenance mode."
    },
    RCON: {
        RCON_ENABLED: false,
        RCON_PASSWORD: "password",
        RCON_PORT: 22103,
        RCON_CLIENT_LIMIT: 1
    },
    AUTO_ACCOUNT: false
}
type DefaultConfig = typeof DEFAULT_CONFIG;

function r(...args: string[]) {
    return fs.readFileSync(resolve(__dirname, ...args)).toString();
}

function readConfig(): any {
    let config: DefaultConfig;
    try {
        config = JSON.parse(r('../../config.json'));
        // Check if config object.keys is the same as DEFAULT_CONFIG.keys
        const missing = Object.keys(DEFAULT_CONFIG).filter(key => !config.hasOwnProperty(key));

        if (missing.length > 0) {
            missing.forEach(key => {
                // @ts-ignore
                config[key] = DEFAULT_CONFIG[key];
            });
            updateConfig(config);
            console.log(`Added missing config keys: ${missing.join(', ')}`);
        }
    } catch {
        console.error("Could not read config file. Creating one for you...");
        config = DEFAULT_CONFIG;
        updateConfig(config);
    }
    return config;
}

function updateConfig(config: any) {
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
}

export default class Config {
    public static config = readConfig();
    public static VERBOSE_LEVEL: VerboseLevel = Config.config.VERBOSE_LEVEL;
    public static MONGO_URI: string = Config.config.MONGO_URI;
    public static HTTP: {
        HTTP_HOST: string,
        HTTP_PORT: number
    } = Config.config.HTTP;
    public static DISPATCH: {
        DISPATCH_NAME: string;
        DISPATCH_URL: string;
    }[] = Config.config.DISPATCH;
    public static GAMESERVER: {
        SERVER_IP: string;
        SERVER_PORT: number;
        MAINTENANCE: boolean;
        MAINTENANCE_MSG: string;
    } = Config.config.GAMESERVER;
    public static AUTO_ACCOUNT: boolean = Config.config.AUTO_ACCOUNT;
    public static RCON: {
        RCON_ENABLED: boolean;
        RCON_PASSWORD: string;
        RCON_PORT: number;
        RCON_CLIENT_LIMIT: number;
    } = Config.config.RCON;

    private constructor() { }
}
