/// <reference types="node" />
import { EventEmitter } from 'events';
import { Snowflake, Channel, DMChannel, TextChannel, GuildChannel, MessageReaction, User } from 'discord.js';
import Collection from '@discordjs/collection';
import StrictEventEmitter from 'strict-event-emitter-types';
import { NonFunction, IBotMessage } from '../interfaces';
import { BotClient } from '../bot-client';
export interface ChannelWatcherEvents {
    deleted: {
        channel: Channel;
    };
    pins: {
        oldPins: Collection<string, IBotMessage>;
        newPins: Collection<string, IBotMessage>;
    };
    update: ChannelDiff;
    'message-delete': {
        channel: TextChannel | DMChannel;
        message: IBotMessage;
    };
    'message-delete-bulk': {
        channel: TextChannel | DMChannel;
        messages: Collection<Snowflake, IBotMessage>;
    };
    'reaction-add': {
        channel: DMChannel | TextChannel;
        message: IBotMessage;
        reaction: MessageReaction;
    };
    'reaction-remove': {
        channel: DMChannel | TextChannel;
        message: IBotMessage;
        reaction: MessageReaction;
    };
    'reaction-remove-all': {
        channel: DMChannel | TextChannel;
        message: IBotMessage;
    };
    message: {
        channel: TextChannel | DMChannel;
        message: IBotMessage;
    };
    typing: {
        channel: TextChannel | DMChannel;
        user: User;
    };
    ready: void;
}
declare type WatchedChannel = DMChannel & GuildChannel;
export declare type ChannelDiff = Partial<NonFunction<WatchedChannel>>;
declare type ChannelWatcherEmitter = StrictEventEmitter<EventEmitter, ChannelWatcherEvents>;
declare const ChannelWatcher_base: new () => ChannelWatcherEmitter;
export declare class ChannelWatcher extends ChannelWatcher_base {
    bot: BotClient;
    guildId: Snowflake;
    channelId: Snowflake;
    type?: keyof typeof ChannelType;
    latestState?: Channel;
    private oldPins?;
    private ready;
    constructor(bot: BotClient, guildId: Snowflake, channelId: Snowflake);
    _channelEventHappened(event: string, data: any): Promise<void>;
    fetchChannel(): Promise<void>;
    destroy(): void;
}
export {};
