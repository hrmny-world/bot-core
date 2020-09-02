import { IBotMessage } from './interfaces';
import { Snowflake } from 'discord.js';
export interface ILevelPerm {
    level: number;
    name: string;
    check: (message: IBotMessage) => boolean | undefined;
    guildOnly?: boolean;
}
export interface IGuildDefaultSettings {
    prefix: string;
    modRole: string;
    adminRole: string;
}
export interface IConfig {
    root?: string;
    name?: string;
    useTypescript: boolean;
    ownerID: Snowflake;
    admins: Snowflake[];
    support: Snowflake[];
    token: string;
    dbltoken: string | false;
    dblcomtoken: string | false;
    bodtoken: string | false;
    dbggtoken: string | false;
    saucetoken: string | false;
    apiport: number;
    debug: boolean;
    defaultSettings: IGuildDefaultSettings;
    defaultProfile: {
        [key: string]: any;
    };
    permLevels: ILevelPerm[];
    messages: {
        [key: string]: string;
    };
}
