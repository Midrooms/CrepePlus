import fs from 'fs';
import {resolve} from 'path';
import Logger from './Logger';

const c = new Logger("Banner");

type Banner = {
    gachaId: number,
    detailWebview: string,
    rateUpItems4: number[],
    rateUpItems5: number[],
    costItemId: number
}

function r(...args: string[]) {
    return resolve(__dirname, ...args);
}

export default class Banners {
    public static config: Banner[];

    public static init() {
        Banners.readConfig();
    }

    private static readConfig() {
        let config: Banner[];

        const defaultConfig: Banner[] = [];

        // TODO: figure where is GachaBasicInfoConfigExcelTable. Temporary hardcode
        const bannersID = [1001, 2001, 2002, 3001, 3002, 4001]

        for (let i = 0; i < bannersID.length; i++) {
            defaultConfig.push({
                gachaId: bannersID[i],
                detailWebview: "",
                rateUpItems4: [
                    1001, 1103
                ],
                rateUpItems5: [
                    1102
                ],
                costItemId: 101 // Star Rail Pass
            } as Banner)
        }

        try {
            config = JSON.parse(fs.readFileSync(r('../../banners.json')).toString());

            for (const [index, gachaBanner] of Object.entries(config)) {
                const missing = Object.keys(defaultConfig[0]).filter(key => !gachaBanner.hasOwnProperty(key));
                if (missing.length > 0) {
                    c.log(`Missing ${missing.join(', ')}, using default values.`);
                    config[parseInt(index)] = defaultConfig[0];
                }
            }
            Banners.updateConfig(config);
        } catch {
            c.error("Could not read banners file. Creating one for you...");
            Banners.updateConfig(defaultConfig);
        }
    }

    private static updateConfig(config: Banner[]) {
        this.config = config;
        fs.writeFileSync(r('../../banners.json'), JSON.stringify(config, null, 2));
    }
}
