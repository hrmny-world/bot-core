"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const interfaces_1 = require("../interfaces");
const collection_1 = __importDefault(require("@discordjs/collection"));
class Command {
    constructor(options) {
        this.name = '';
        this.description = '';
        this.usage = '';
        this.run = () => { };
        this.aliases = [];
        this.permission = 0;
        this.cooldown = 3;
        this.runIn = ['text'];
        this.hidden = false;
        this.requiredArgs = [];
        this.examples = [];
        this.category = 'other';
        this.delete = false;
        this.init = () => { };
        this.shutdown = () => { };
        if (!('name' in options)) {
            throw new TypeError('A command must have a name.');
        }
        if (!('description' in options)) {
            throw new TypeError('A command must have a description.');
        }
        if (!('run' in options)) {
            throw new TypeError('A command must have a handler function.');
        }
        Object.assign(this, options);
    }
}
exports.Command = Command;
Command.Permission = interfaces_1.Permission;
exports.splitArguments = (content, prefix) => {
    var _a;
    const args = content
        .trim()
        .substr(prefix.length)
        .replace(/(\s\s+|\n)/g, ' ')
        .split(/ +/);
    const command = (_a = args
        .shift()) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
    return {
        command,
        args,
    };
};
exports.validatePrefix = (message, defaultPrefix, guildPrefixes) => {
    var _a, _b, _c;
    const content = message.content
        .trim()
        .toLowerCase()
        .replace(/\s\s+/g, ' ');
    if (!guildPrefixes) {
        return content.startsWith(defaultPrefix) ? defaultPrefix : false;
    }
    const guildId = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id;
    const customPrefix = ((_b = guildPrefixes.get(guildId)) === null || _b === void 0 ? void 0 : _b.prefix) === defaultPrefix
        ? false
        : (_c = guildPrefixes.get(guildId)) === null || _c === void 0 ? void 0 : _c.prefix;
    if (customPrefix && content.startsWith(defaultPrefix)) {
        return false;
    }
    if (customPrefix && content.startsWith(customPrefix)) {
        return customPrefix;
    }
    if (!customPrefix && content.startsWith(defaultPrefix)) {
        return defaultPrefix;
    }
    return false;
};
exports.buildCommandMetadata = (bot, message, prefix) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const meta = {};
    meta.isDM = message.channel.type === 'dm';
    meta.userId = message.author.id;
    meta.tag = message.author.tag;
    meta.username = message.author.username;
    meta.nickname = (_b = (_a = message.member) === null || _a === void 0 ? void 0 : _a.nickname) !== null && _b !== void 0 ? _b : null;
    meta.guild = message.guild;
    meta.message = message;
    meta.time = new Date();
    meta.permLevel = bot.permlevel(message);
    const { command, args } = exports.splitArguments(message.content, prefix);
    let cmd = bot.commands.get(command);
    let isAlias = false;
    if (!cmd && bot.aliases.has(command)) {
        isAlias = true;
        cmd = bot.commands.get(bot.aliases.get(command));
    }
    meta.command = cmd !== null && cmd !== void 0 ? cmd : null;
    meta.commandName = (_c = cmd === null || cmd === void 0 ? void 0 : cmd.name) !== null && _c !== void 0 ? _c : null;
    meta.calledByAlias = isAlias;
    meta.args = args;
    meta.content = args
        .slice((_e = (_d = cmd === null || cmd === void 0 ? void 0 : cmd.requiredArgs) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0)
        .join(' ')
        .trim();
    meta.contentFull = args.join(' ').trim();
    if ((_g = (_f = cmd === null || cmd === void 0 ? void 0 : cmd.requiredArgs) === null || _f === void 0 ? void 0 : _f.length) !== null && _g !== void 0 ? _g : 0 > args.length) {
        meta.missingArg = (_j = (_h = cmd === null || cmd === void 0 ? void 0 : cmd.requiredArgs) === null || _h === void 0 ? void 0 : _h[args.length]) !== null && _j !== void 0 ? _j : null;
    }
    else {
        meta.missingArg = null;
    }
    meta.prefix = prefix;
    return meta;
};
class CooldownManager extends collection_1.default {
    constructor(bot) {
        super();
        if (!bot)
            throw new Error('CooldownManager needs a client.');
        this.bot = bot;
    }
    loadCommands(commands) {
        commands.forEach(cmd => {
            super.set(cmd.name.toLowerCase(), new collection_1.default());
        });
    }
    updateTimeLeft(commandName, userId) {
        if (!this.bot.commands.has(commandName)) {
            throw new Error(`Could not update cooldown because command ${commandName} was not found.`);
        }
        const now = Date.now();
        const timestamps = super.get(commandName);
        if (timestamps) {
            timestamps.set(userId, now);
        }
        else {
            throw new Error(`Could not update cooldown because there was no collection for the command ${commandName}.`);
        }
    }
    getTimeLeft(commandName, userId) {
        var _a;
        if (!this.bot.commands.has(commandName)) {
            throw new Error(`Could not get cooldown left for user ${userId} because "${commandName}" was not in the bot.commands collection.`);
        }
        const cmd = this.bot.commands.get(commandName);
        const now = Date.now();
        const cooldownAmount = ((_a = cmd.cooldown) !== null && _a !== void 0 ? _a : 3) * 1000;
        const timestamps = super.get(commandName);
        if (!timestamps) {
            throw new Error(`Could not get cooldown left for user ${userId} because there was no timestamps collection for the command ${commandName}.`);
        }
        if (timestamps.has(userId)) {
            const expirationTime = timestamps.get(userId) + cooldownAmount;
            if (now < expirationTime) {
                return Number(((expirationTime - now) / 1000).toFixed(1));
            }
            return 0;
        }
        this.updateTimeLeft(commandName, userId);
        this.bot.setTimeout(() => timestamps.delete(userId), cooldownAmount);
        return 0;
    }
}
exports.CooldownManager = CooldownManager;
