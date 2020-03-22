import { ICommandOptions, Permission, IBotMessage, CommandMetadata, IBotClient } from '../interfaces';
import Collection from '@discordjs/collection';
import { Snowflake } from 'discord.js';
export declare class Command<T = {
    [key: string]: any;
}> implements ICommandOptions<T> {
    name: ICommandOptions<T>['name'];
    description: ICommandOptions<T>['description'];
    usage: ICommandOptions<T>['usage'];
    run: ICommandOptions<T>['run'];
    aliases: ICommandOptions<T>['aliases'];
    permission: ICommandOptions<T>['permission'];
    cooldown: ICommandOptions<T>['cooldown'];
    runIn: ICommandOptions<T>['runIn'];
    hidden: ICommandOptions<T>['hidden'];
    requiredArgs: ICommandOptions<T>['requiredArgs'];
    examples: ICommandOptions<T>['examples'];
    category: ICommandOptions<T>['category'];
    delete: ICommandOptions<T>['delete'];
    init: ICommandOptions<T>['init'];
    shutdown: ICommandOptions<T>['shutdown'];
    send: ICommandOptions<T>['send'];
    static readonly Permission: typeof Permission;
    constructor(options: ICommandOptions<T>);
}
export declare const splitArguments: (content: string, prefix: string) => {
    command: string | undefined;
    args: string[];
};
export declare const validatePrefix: (message: IBotMessage, defaultPrefix: string, guildPrefixes?: Map<string, any> | undefined) => string | false;
export declare const buildCommandMetadata: (bot: IBotClient, message: IBotMessage, prefix: string) => CommandMetadata;
export declare class CooldownManager extends Collection<string, Collection<Snowflake, number>> {
    bot: IBotClient;
    constructor(bot: IBotClient);
    loadCommands(commands: IBotClient['commands']): void;
    updateTimeLeft(commandName: string, userId: Snowflake): void;
    getTimeLeft(commandName: string, userId: Snowflake): number;
}
