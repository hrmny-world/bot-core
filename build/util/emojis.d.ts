import { Guild, GuildEmoji } from 'discord.js';
export declare const regex: RegExp;
export declare function parse(text: string, guild?: Guild): (string | GuildEmoji)[];
