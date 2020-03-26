import { Client, GuildChannel, Guild, Snowflake, Message, StringResolvable, MessageEditOptions, MessageEmbed, MessageOptions, MessageAdditions } from 'discord.js';
import Collection from '@discordjs/collection';
import { IConfig } from './bot.config';
import { Command, CooldownManager } from './modules';
import { BotClient } from './bot-client';
export declare type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
interface ExtendedClient {
    config: IConfig;
    memory: number;
    version: string;
    userCount: number;
    serverCount: number;
    commands: Collection<string, Command>;
    aliases: Collection<string, string>;
    cooldowns: CooldownManager;
    permlevel(message: IBotMessage): number;
    clean(text: string): Promise<string>;
    wait(time: number): Promise<void>;
    randInt(min: number, max: number): number;
    colorInt(hex: string): number;
    getChannelsInMessage(message: IBotMessage): Promise<GuildChannel[]>;
    lines(...lines: string[]): string;
    appendMsg(msg: IBotMessage, content: string, delay?: number): Promise<IBotMessage>;
    loadCommand(command: Command): Promise<void>;
    helpers: {
        wait: ExtendedClient['wait'];
        randInt: ExtendedClient['randInt'];
        colorInt: ExtendedClient['colorInt'];
        getChannelsInMessage: ExtendedClient['getChannelsInMessage'];
        lines: ExtendedClient['lines'];
        appendMsg: ExtendedClient['appendMsg'];
    };
    permLevelCache: {
        [key: string]: number;
    };
}
export interface IBotClient extends Overwrite<Client, ExtendedClient> {
}
export interface IBotMessage extends Overwrite<Message, {
    client: IBotClient;
    edit(content: StringResolvable, options?: MessageEditOptions | MessageEmbed): Promise<IBotMessage>;
}> {
}
export declare type CombinedMeta<T> = CommandMetadata & T;
declare type ISendFnLastArg = string | MessageOptions | MessageAdditions;
declare type ISendFnReturn = Promise<void | IBotMessage>;
export interface ICommandOptions<T> {
    name: string;
    description: string;
    usage?: string;
    examples?: string[];
    help?: string;
    category?: string;
    aliases?: string[];
    permission: number;
    cooldown?: number;
    runIn?: ('text' | 'dm' | 'guild')[];
    hidden?: boolean;
    requiredArgs?: string[];
    delete?: boolean;
    run(bot: BotClient, message: IBotMessage, meta: CombinedMeta<T>): any;
    init?(bot: IBotClient): void;
    shutdown?(bot: IBotClient): void;
    send?(arg1: any): ISendFnReturn;
    send?(arg1: any, options: ISendFnLastArg): ISendFnReturn;
    send?(arg1: any, arg2: any, options: ISendFnLastArg): ISendFnReturn;
    send?(arg1: any, arg2: any, arg3: any, options: ISendFnLastArg): ISendFnReturn;
    send?(arg1: any, arg2: any, arg3: any, arg4: any, options: ISendFnLastArg): ISendFnReturn;
    send?(arg1: any, arg2: any, arg3: any, arg4: any, arg5: any, options: ISendFnLastArg): ISendFnReturn;
    send?(arg1: any, arg2: any, arg3: any, arg4: any, arg5: any, arg6: any, options: ISendFnLastArg): ISendFnReturn;
    send?(arg1: any, arg2: any, arg3: any, arg4: any, arg5: any, arg6: any, arg7: any, options: ISendFnLastArg): ISendFnReturn;
    send?(arg1: any, arg2: any, arg3: any, arg4: any, arg5: any, arg6: any, arg7: any, arg8: any, options: ISendFnLastArg): ISendFnReturn;
    send?(arg1: any, arg2: any, arg3: any, arg4: any, arg5: any, arg6: any, arg7: any, arg8: any, arg9: any, options: ISendFnLastArg): ISendFnReturn;
    send?(arg1: any, arg2: any, arg3: any, arg4: any, arg5: any, arg6: any, arg7: any, arg8: any, arg9: any, arg10: any, options: ISendFnLastArg): ISendFnReturn;
}
export interface CommandMetadata {
    userId: Snowflake;
    tag: string | null;
    username: string;
    nickname: string | null;
    guild: Guild | null;
    command: Command | null;
    commandName: string | null;
    prefix: string | false;
    content: string;
    contentFull: string;
    args: string[];
    missingArg: string | null;
    isDM: boolean;
    permLevel: number;
    calledByAlias: boolean;
    message: IBotMessage;
    time: Date;
}
export declare type IEventHandler = (bot: IBotClient) => void;
export declare enum Permission {
    USER = 0,
    MANAGE_MESSAGES = 2,
    MANAGE_ROLES = 3,
    MANAGE_GUILD = 4,
    SERVER_OWNER = 5,
    BOT_SUPPORT = 8,
    BOT_ADMIN = 9,
    BOT_OWNER = 10
}
export {};
