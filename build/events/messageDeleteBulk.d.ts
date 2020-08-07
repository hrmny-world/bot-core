import { Snowflake } from 'discord.js';
import Collection from '@discordjs/collection';
import { BotClient } from '../bot-client';
import { IBotMessage } from '../interfaces';
declare const _default: (bot: BotClient, messages: Collection<Snowflake, IBotMessage>) => void;
export default _default;
