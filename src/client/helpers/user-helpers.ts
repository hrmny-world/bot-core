import { User, GuildMember, UserResolvable, Message } from 'discord.js';
import { BotClient } from '../bot-client';

/**
 * Tries to find an user's name.
 * If they have a nickname return the nickname else their username.
 * @param search Something that could be or contain an user
 * @param client The bot's client
 * @returns Null if no user could be found
 */
export function getPersonName(search: UserResolvable, client?: BotClient): string | null {
  if (!search) return null;
  if (search instanceof Message) {
    return getPersonName(search.member ?? search.author);
  }
  if (search instanceof GuildMember) {
    return search.nickname ?? search.user.username;
  }
  if (search instanceof User) {
    return search.username;
  }
  if (typeof search === 'string' && client instanceof BotClient) {
    return getPersonName(client.users.cache.get(search)!) ?? null;
  }
  return null;
}
