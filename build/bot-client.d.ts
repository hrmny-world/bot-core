/// <reference types="node" />
import { Client, GuildChannel, ClientOptions } from 'discord.js';
import { IBotClient, IBotMessage } from './interfaces';
import { IConfig } from './bot.config';
import { Command } from './modules';
import { IPrefixChecker, ICommandExtenders, IMetaExtender } from './events/message';
export declare class BotClient extends Client implements IBotClient {
    config: IBotClient['config'];
    commands: IBotClient['commands'];
    aliases: IBotClient['aliases'];
    permLevelCache: IBotClient['permLevelCache'];
    cooldowns: IBotClient['cooldowns'];
    channelWatchers: IBotClient['channelWatchers'];
    extensions: ICommandExtenders;
    constructor(config: IConfig, options?: ClientOptions);
    wait: typeof setTimeout.__promisify__;
    randInt: (min: number, max: number) => number;
    colorInt: (hexIn: string) => number;
    lines: (...lines: string[]) => string;
    appendMsg: (msg: IBotMessage, content: string, delay?: number) => Promise<IBotMessage>;
    getChannelsInMessage: (message: IBotMessage) => Promise<GuildChannel[]>;
    clean: (text: string) => Promise<string>;
    permlevel: (message: IBotMessage) => number;
    helpers: {
        wait: typeof setTimeout.__promisify__;
        randInt: (min: number, max: number) => number;
        colorInt: (hexIn: string) => number;
        getChannelsInMessage: (message: IBotMessage) => Promise<GuildChannel[]>;
        lines: (...lines: string[]) => string;
        appendMsg: (msg: IBotMessage, content: string, delay?: number) => Promise<IBotMessage>;
    };
    get memory(): number;
    get userCount(): number;
    get serverCount(): number;
    get version(): string;
    loadCommand(command: Command): Promise<void>;
    private _loadCommandsIntoClient;
    private _loadEventsIntoClient;
    extend: {
        prefixChecking: (checker: IPrefixChecker) => void;
        metaParsing: (extender: IMetaExtender) => void;
    };
    login(token: string): Promise<string>;
}
