import { TextChannel } from 'discord.js';
import { BotClient, IBotMessage, validatePrefix, buildCommandMetadata, ILevelPerm } from '..';
import { formatString, isObject, time } from '../util';
import { CombinedMeta } from '../interfaces';

export type IPrefixChecker = (bot: BotClient, message: IBotMessage) => string | false;
export type IMetaExtender = <T>(meta: CombinedMeta<T>) => void | Promise<void>;

export interface ICommandExtenders {
  prefixCheckers: IPrefixChecker[];
  metaExtenders: IMetaExtender[];
}

export const commandRunner = (extensions: ICommandExtenders, bot: BotClient) => async (
  message: IBotMessage,
) => {
  // Channel watchers
  bot.setImmediate(() => {
    bot.channelWatchers.forEach(watcher => {
      if (message.channel.id !== watcher.channelId) return;
      watcher._channelEventHappened('message', { message, channel: message.channel });
    });
  });

  // Command handling

  // Don't answer to bots
  if (message.author.bot) return;

  let prefix: string | false = false;
  if (extensions.prefixCheckers.length) {
    for (const check of extensions.prefixCheckers) {
      try {
        prefix = check(bot, message);
        if ((prefix as any) instanceof Promise) {
          // await in for..of loop because this must be sequential
          prefix = await prefix;
        }
      } catch (err) {
        err.message = 'A prefix check function threw an error.\n\n' + err.message;
        bot.emit('error', err);
        return;
      }
      if (!prefix) return;
    }
  } else {
    prefix = validatePrefix(message, bot.config.defaultSettings.prefix);
  }

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if (!prefix) {
    return;
  }

  // Parses the command and gets useful data
  const meta = buildCommandMetadata(bot, message, prefix);

  if (extensions.metaExtenders.length) {
    for (const extension of extensions.metaExtenders) {
      try {
        const extended = extension(meta);
        if (extended instanceof Promise) {
          // await in for..of loop because this must be sequential
          await extended;
        }
      } catch (err) {
        err.message = 'A meta extension function threw an error.\n\n' + err.message;
        bot.emit('error', err);
        return;
      }
    }
  }

  // If the member on a guild is invisible or not cached, fetch them.
  if (!meta.isDM && !message.member) await message.guild?.members.fetch({ user: message.author });

  // Check whether the command, or alias, exist in the collections defined in bot-client.ts
  if (!meta.command) return;

  // Some commands may not be useable in DMs. This check prevents those commands from running
  // and return a friendly error message.
  if (meta.isDM && !meta.command.runIn?.includes('dm')) {
    try {
      await message.channel.send(
        'This command is unavailable via private message. Please run this command in a server.',
      );
      return;
    } catch {
      /* This is fine. */
    }
  }

  // And some commands are only usable in DMs
  if (
    !meta.isDM &&
    !(meta.command.runIn?.includes('text') || meta.command.runIn?.includes('guild'))
  ) {
    try {
      await message.channel.send(
        'This command is only available via private message. Please run this command in a DM.',
      );
      return;
    } catch {
      /* This is fine. */
    }
  }

  const requiredPermLevel = bot.config.permLevels.find(
    (l: ILevelPerm) => l.level === meta.command!.permission,
  )!;
  const userPermLevel = bot.config.permLevels.find((l: ILevelPerm) => l.level === meta.permLevel)!;
  if (meta.permLevel < meta.command.permission!) {
    if (!requiredPermLevel) {
      bot.emit(
        'error',
        new Error(
          `Permission level ${meta.command.permission} in command ${meta.command.name} not found in the config!`,
        ),
      );
      return;
    }
    const sendNoPermissionMessage = async () => {
      try {
        await message.channel.send(
          bot.lines(
            'You do not have permission to use this command.',
            `Your permission level is ${meta.permLevel} (${userPermLevel.name})`,
            `This command requires level ${requiredPermLevel.level} (${requiredPermLevel.name})`,
          ),
        );
      } catch {
        /* This is fine. */
      }
    };
    return (
      // Don`t send message if command is hidden
      meta.command.hidden ?? sendNoPermissionMessage()
    );
  }

  if (meta.missingArg) {
    try {
      message.channel.send(
        formatString(
          bot.config.messages.USAGE,
          meta.missingArg,
          `\`${prefix}${meta.commandName} ${meta.command.usage ||
            meta.command.requiredArgs?.map(a => `{${a}}`).join(' ')}\``,
        ),
      );
    } catch {
      /* This is fine. */
    }
    return;
  }

  const cooldownLeft = bot.cooldowns.getTimeLeft(meta.commandName!, meta.userId);

  if (cooldownLeft > 0) {
    try {
      await message.channel.send(
        formatString(
          bot.config.messages.COOLDOWN,
          time.secondsToHumanReadable(cooldownLeft),
          meta.commandName,
        ),
      );
    } catch {
      /* This is fine. */
    }
    return;
  }

  bot.cooldowns.updateTimeLeft(meta.commandName!, meta.userId);

  if (meta.command.delete) {
    try {
      await message.delete({ reason: `Executed the ${meta.commandName} command.` });
    } catch {
      /* This is fine. */
    }
  }

  const safeSend = (...args: any): Promise<void | IBotMessage> => {
    const lines = [...args];
    const lastArg = lines.pop();
    const msg = bot.helpers.lines(...lines, typeof lastArg === 'string' ? lastArg : '');

    return message.channel.send(msg, isObject(lastArg) ? lastArg : undefined).catch(err => {
      const channelName = (message.channel as TextChannel).name;
      const channelId = message.channel.id;
      const guildName = meta.guild?.name;
      const guildId = meta.guild?.id;
      bot.emit(
        'warn',
        bot.helpers.lines(
          `Could not send message.`,
          `Channel: ${channelName} (${channelId})`,
          `Guild: ${guildName} (${guildId})`,
          `DM: ${meta.isDM}`,
          `Error: ${err.message}`,
        ),
      );
    }) as Promise<void | IBotMessage>;
  };

  meta.command.send = safeSend;

  // Log the command usage
  bot.emit('command', meta);

  // This is to support regular functions and async functions as the run property
  const safelyRun = (subject: () => void | Promise<any>, errorHandler: (err: Error) => void) => {
    try {
      (subject() as Promise<any>).catch(errorHandler);
    } catch (err) {
      if (err instanceof TypeError && /catch/.test(err.message)) {
        // This error is from running .catch() in a normal function. We can ignore.
      } else {
        errorHandler(err);
      }
    }
  };

  const errorHandler = (err: Error) => {
    const channelName = (message.channel as TextChannel).name;
    const channelId = message.channel.id;
    const guildName = meta.guild?.name;
    const guildId = meta.guild?.id;
    const errorMsg = err.stack?.replace(new RegExp(`${__dirname}/`, 'g'), './');
    err.stack =
      `An error ocurred in the ${meta.commandName} command.\n` +
      bot.helpers.lines(
        `Could not send message.`,
        `Channel: ${channelName} (${channelId})`,
        `Guild: ${guildName} (${guildId})`,
        `DM: ${meta.isDM}`,
        errorMsg!,
      ) +
      err.stack;
    bot.emit('error', err);
  };

  // If the command exists, **AND** the user has permission, run it.
  safelyRun(() => meta.command?.run(bot, message, meta), errorHandler);
};
