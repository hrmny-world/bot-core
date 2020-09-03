/// <reference types="node" />
import { IBotMessage, IListenerOptions, CombinedMeta } from '../interfaces';
import { BotClient } from '../bot-client';
import Collection from '@discordjs/collection';
import { Snowflake } from 'discord.js';
export declare const COMMON_EXPRESSIONS: {
    me: string;
    action: string;
    yes: string;
    no: string;
    be: string;
};
export declare const stringMatch: (message: IBotMessage, words: string | string[]) => boolean | RegExpMatchArray | null;
export declare class Listener<T = {
    [key: string]: any;
}> implements IListenerOptions<T> {
    words: IListenerOptions<T>['words'];
    cooldown: IListenerOptions<T>['cooldown'];
    category: IListenerOptions<T>['category'];
    priority: IListenerOptions<T>['priority'];
    globalCooldown: IListenerOptions<T>['globalCooldown'];
    run: IListenerOptions<T>['run'];
    init: IListenerOptions<T>['init'];
    _cooldowns: IListenerOptions<T>['_cooldowns'];
    send: any;
    constructor({ words, cooldown, category, globalCooldown, priority, run }: IListenerOptions<T>);
    evaluate(message: IBotMessage, meta: CombinedMeta<T>): any;
    toString(): string;
    [Symbol.toStringTag]: string;
}
interface IgnoreSettings {
    start: number;
    duration: number;
    timeout: NodeJS.Timer | null;
}
export declare class ListenerIgnoreList {
    bot: BotClient;
    guilds: Collection<Snowflake, IgnoreSettings>;
    channels: Collection<Snowflake, IgnoreSettings>;
    constructor(bot: BotClient);
    clear(): void;
    ignoreChannel(id: Snowflake, duration?: number): void;
    ignoreGuild(id: Snowflake, duration?: number): void;
    listenChannel(id: Snowflake): void;
    listenGuild(id: Snowflake): void;
}
export declare class ListenerRunner {
    bot: BotClient;
    mappedListeners: {
        [key: string]: Listener[];
    };
    options: {
        [key: string]: any;
    };
    constructor(bot: BotClient, options: {
        [key: string]: any;
    });
    listen(): void;
}
export {};
