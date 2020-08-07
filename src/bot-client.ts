import { promisify, inspect } from 'util';
import { Client, GuildChannel, ClientOptions, ClientEvents } from 'discord.js';
import Collection from '@discordjs/collection';

import { IBotClient, IEventHandler, IBotMessage } from './interfaces';
import { IConfig } from './bot.config';
import { FileLoader, Command, CooldownManager, ChannelWatcher } from './modules';
import { IPrefixChecker, ICommandExtenders, IMetaExtender, commandRunner } from './events/message';
import * as events from './events';
// import { webServer } from './web';

export class BotClient extends Client implements IBotClient {
  config: IBotClient['config'];
  commands: IBotClient['commands'];
  aliases: IBotClient['aliases'];
  permLevelCache: IBotClient['permLevelCache'];
  cooldowns: IBotClient['cooldowns'];
  channelWatchers: IBotClient['channelWatchers'];
  extensions: ICommandExtenders;
  emit!: IBotClient['emit'];

  constructor(config: IConfig, options: ClientOptions = { disableMentions: 'everyone' }) {
    super(options);

    // Config
    this.config = config;

    // Command stuff
    this.commands = new Collection();
    this.aliases = new Collection();
    this.cooldowns = new CooldownManager(this);
    this.channelWatchers = new Collection<string, ChannelWatcher>();

    const permLevelCache: { [key: string]: number } = {};
    for (let i = 0; i < this.config.permLevels.length; i++) {
      const thisLevel = this.config.permLevels[i];
      permLevelCache[thisLevel.name as string] = thisLevel.level;
    }
    this.permLevelCache = permLevelCache;

    this.extensions = {
      metaExtenders: [],
      prefixCheckers: [],
    };
  }

  // Helper Functions
  wait = promisify(setTimeout);
  randInt = (min: number, max: number) => Math.floor(Math.random() * (+max - +min)) + +min;
  colorInt = (hexIn: string) => parseInt(hexIn.split('#')[1], 16);

  lines = (...lines: string[]) => {
    if (!lines || !lines.length) {
      return '';
    }
    if (lines.length === 1) {
      return String(lines[0]).trim();
    }
    return lines.reduce((all, current) => `${all}\n${String(current).trim()}`, '').trim();
  };

  appendMsg = async (
    msg: IBotMessage,
    content: string,
    delay: number = 0,
  ): Promise<IBotMessage> => {
    try {
      await this.wait(delay);
      msg = await msg?.edit(`${msg?.content}${content}`);
    } catch {}
    return msg;
  };

  getChannelsInMessage = async (message: IBotMessage): Promise<GuildChannel[]> => {
    const channelMentionRegex = /(?<=<#)(\d+?)(?=>)/g;
    const channelsInMessage = message.content.match(channelMentionRegex) || [];

    if (!message.guild) return [];
    if (channelsInMessage.length === 0) return [];

    const channelsInGuild = message.guild.channels.cache.filter((c) => c.type === 'text');

    const channels = channelsInMessage
      // remove duplicates
      .filter((v, i, a) => a.indexOf(v) === i)
      // get the channels
      .map((channelId) => channelsInGuild.get(channelId))
      // remove falsy values
      .filter((c) => c !== undefined) as GuildChannel[];

    return channels;
  };

  /*
  MESSAGE CLEAN FUNCTION
  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
  This is mostly only used by the Eval and Exec commands.
  */
  clean = async (text: string) => {
    if (text && text.constructor.name == 'Promise') text = await text;
    if (typeof text !== 'string') text = inspect(text, { depth: 1 });

    text = text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(this.config.token, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');

    return text;
  };

  /*
  PERMISSION LEVEL FUNCTION
  This is a very basic permission system for commands which uses "levels"
  "spaces" are intentionally left black so you can add them if you want.
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command including the VERY DANGEROUS `eval` and `exec` commands!
  */
  permlevel = (message: IBotMessage) => {
    let permlvl = 0;

    const permOrder = this.config.permLevels.slice(0).sort((p, c) => (p.level < c.level ? 1 : -1));

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel!.guildOnly) continue;
      if (currentLevel!.check(message)) {
        permlvl = currentLevel!.level;
        break;
      }
    }
    return permlvl;
  };

  // Helper Alias
  helpers = {
    wait: this.wait,
    randInt: this.randInt,
    colorInt: this.colorInt,
    getChannelsInMessage: this.getChannelsInMessage,
    lines: this.lines,
    appendMsg: this.appendMsg,
  };

  // Getters

  get memory() {
    return process.memoryUsage().heapUsed / 1024 / 1024;
  }

  get userCount() {
    return this.users.cache.filter((u) => !u.bot).size;
  }

  get serverCount() {
    return this.guilds.cache.size;
  }

  get version() {
    return process.env.npm_package_version!;
  }

  // ! Critical functions

  async loadCommand(command: Command) {
    try {
      this.emit('debug', `Loading Command: ${command.name}`);
      if (command.init) {
        command.init(this);
      }
      this.commands.set(command.name, command);
      command.aliases?.forEach((alias) => {
        this.aliases.set(alias, command.name);
      });
    } catch (e) {
      this.emit('error', new Error(`Unable to load command ${command.name}: ${e}`));
    }
  }

  private async _loadCommandsIntoClient() {
    const { root, debug, useTypescript } = this.config;
    const cmdFiles = await FileLoader.loadDirectory({
      ImportClass: Command,
      dir: 'commands',
      root,
      debug,
      useTypescript,
    });

    // Promise.all for performance
    await Promise.all([...cmdFiles.map((cmd) => this.loadCommand(cmd as any))]);
  }

  private async _loadEventsIntoClient() {
    const { root, debug, useTypescript } = this.config;
    const evtFiles = await FileLoader.readDirectory({
      dir: 'events',
      root,
      debug,
      useTypescript,
    });

    evtFiles.forEach((filePath) => {
      const splits = filePath.split(/(\/|\\)/g);
      const eventName = splits[splits.length - 1].split('.')[0];
      const requiredEventModule = module.require(filePath.replace(__dirname, './'));

      let event: IEventHandler;
      if (requiredEventModule && typeof requiredEventModule === 'function') {
        event = requiredEventModule;
      } else if (requiredEventModule && typeof requiredEventModule.default === 'function') {
        event = requiredEventModule.default;
      }

      if (event!) {
        // Bind the client to any event, before the existing arguments
        // provided by the discord.js event.
        this.on(eventName as keyof ClientEvents, event!.bind(null, this));
      }
    });
  }

  extend = {
    prefixChecking: (checker: IPrefixChecker) => {
      this.extensions.prefixCheckers.push(checker);
    },
    metaParsing: (extender: IMetaExtender) => {
      this.extensions.metaExtenders.push(extender);
    },
  };

  async login(token: string) {
    // Here we load **commands** into memory, as a collection, so they're accessible
    // here and everywhere else.
    await this._loadCommandsIntoClient();

    // Then we load events, which will include our message and ready event.
    await this._loadEventsIntoClient();

    // Pass the command collection into the cooldowns manager.
    this.cooldowns.loadCommands(this.commands);

    // Listen to commands
    this.on(
      'message',
      (commandRunner(this.extensions, this) as unknown) as (
        ...args: ClientEvents['message']
      ) => void,
    );

    // Channel Watcher events
    for (const [eventName, eventHandler] of Object.entries(events)) {
      this.on(eventName as keyof ClientEvents, (eventHandler as IEventHandler).bind(null, this));
    }

    // call Discord.Client's login()
    return super.login(token);
  }
}

// Express server to keep the heroku app awake
// const server = webServer(bot);
