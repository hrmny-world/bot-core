"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenerRunner = exports.ListenerIgnoreList = exports.Listener = exports.stringMatch = exports.COMMON_EXPRESSIONS = void 0;
const collection_1 = __importDefault(require("@discordjs/collection"));
const util_1 = require("../util");
const command_1 = require("./command");
exports.COMMON_EXPRESSIONS = {
    me: "i('m|m|'ve|'ll|ll|mma)*",
    action: '(want|wanna|gonna|going to|will)',
    yes: '(y|yes|ye|yeah|indeed|correct|mhm|sure|ok|okay|alright|alrighty|why not)',
    no: '(no|na|nah|not really|nope)',
    be: "(i'm|am|was|will be|are|were|is|be)",
};
exports.stringMatch = (message, words) => {
    function commonWord(placeholder) {
        if (Array.isArray(placeholder)) {
            return placeholder;
        }
        const w = placeholder ? `${placeholder.replace(/(\{|\})/g, '').trim()}` : '';
        if (exports.COMMON_EXPRESSIONS[w]) {
            return exports.COMMON_EXPRESSIONS[w];
        }
        return placeholder;
    }
    const content = (message.content || '')
        .replace(/[\.,\/#!$%\^&\*;:\{\}=\-_`~()\?]/g, '')
        .replace(/\s{2,}/g, ' ')
        .toLowerCase();
    const makeRegex = (w) => {
        return new RegExp(`(\\s+${w}\\s+|\\s+${w}$|^${w}\\s+|^${w}$)`);
    };
    const wordRegex = makeRegex(commonWord(words));
    if (Array.isArray(words)) {
        return words.map(commonWord).every((w) => content.match(makeRegex(w)));
    }
    return content.match(wordRegex);
};
class Listener {
    constructor({ words, cooldown, category, globalCooldown, priority, run }) {
        this[Symbol.toStringTag] = 'Listener';
        if (!words || (!cooldown && cooldown !== 0) || !run) {
            throw new Error('A listener requires words, cooldown and a run function.');
        }
        this.words = words;
        this.category = category;
        this.cooldown = cooldown;
        this._cooldowns = new Map();
        this.globalCooldown = globalCooldown || undefined;
        this.priority = Number(priority) || 0;
        this.run = run;
    }
    evaluate(message, meta) {
        var _a;
        const { author } = message;
        if (author.bot)
            return false;
        if (this.globalCooldown && Date.now() - (this._cooldowns.get('GLOBAL') || NaN) < 0)
            return false;
        if (!this._cooldowns.get(author.id) || Date.now() - this._cooldowns.get(author.id) > 0) {
            if (exports.stringMatch(message, this.words)) {
                if (message.client.botListeners.ignored.guilds.has((_a = message.guild) === null || _a === void 0 ? void 0 : _a.id))
                    return;
                if (message.client.botListeners.ignored.channels.has(message.channel.id))
                    return;
                const result = this.run(message.client, message, meta);
                this._cooldowns.set(author.id, Date.now() + this.cooldown * 1000);
                if (this.globalCooldown) {
                    this._cooldowns.set('GLOBAL', Date.now() + this.globalCooldown * 1000);
                }
                return result;
            }
        }
        return false;
    }
    toString() {
        const words = Array.isArray(this.words) ? this.words.join(' ') : this.words;
        return `Listener [${words} / ${this.category}]`;
    }
}
exports.Listener = Listener;
class ListenerIgnoreList {
    constructor(bot) {
        this.bot = bot;
        this.guilds = new collection_1.default();
        this.channels = new collection_1.default();
    }
    clear() {
        const clearTimeout = (ignored) => ignored.timeout ? this.bot.clearTimeout(ignored.timeout) : null;
        this.guilds.forEach(clearTimeout);
        this.guilds.clear();
        this.channels.forEach(clearTimeout);
        this.channels.clear();
    }
    ignoreChannel(id, duration = 0) {
        var _a;
        if (Array.isArray(id)) {
            id.forEach((i) => this.ignoreChannel(i, duration));
            return;
        }
        if ((_a = this.channels.get(id)) === null || _a === void 0 ? void 0 : _a.timeout) {
            this.bot.clearTimeout(this.channels.get(id).timeout);
        }
        this.channels.set(id, {
            start: Date.now(),
            duration,
            timeout: duration ? this.bot.setTimeout(() => this.channels.delete(id), duration) : null,
        });
    }
    ignoreGuild(id, duration = 0) {
        var _a;
        if (Array.isArray(id)) {
            id.forEach((i) => this.ignoreGuild(i, duration));
            return;
        }
        if ((_a = this.guilds.get(id)) === null || _a === void 0 ? void 0 : _a.timeout) {
            this.bot.clearTimeout(this.guilds.get(id).timeout);
        }
        this.guilds.set(id, {
            start: Date.now(),
            duration,
            timeout: duration ? this.bot.setTimeout(() => this.guilds.delete(id), duration) : null,
        });
    }
    listenChannel(id) {
        if (Array.isArray(id)) {
            id.forEach(this.listenChannel);
        }
        if (this.channels.has(id)) {
            const { timeout } = this.channels.get(id);
            if (timeout)
                this.bot.clearTimeout(timeout);
            this.channels.delete(id);
        }
    }
    listenGuild(id) {
        if (Array.isArray(id)) {
            id.forEach(this.listenGuild);
        }
        if (this.guilds.has(id)) {
            const { timeout } = this.guilds.get(id);
            if (timeout)
                this.bot.clearTimeout(timeout);
            this.guilds.delete(id);
        }
    }
}
exports.ListenerIgnoreList = ListenerIgnoreList;
class ListenerRunner {
    constructor(bot, options) {
        this.bot = bot;
        this.options = options;
        this.mappedListeners = {};
        this.bot.botListeners.forEach((l) => {
            const c = l.category || 'other';
            this.mappedListeners[c] = [...(this.mappedListeners[c] || []), l];
            this.mappedListeners[c].sort((a, b) => a.priority - b.priority);
        });
    }
    listen(extensions) {
        this.bot.on('message', (message) => {
            const bot = this.bot;
            const channel = () => message.channel;
            if (message.author.bot)
                return;
            if (!message.guild) {
                return;
            }
            if (bot.botListeners.ignored.guilds.has(message.guild.id))
                return;
            if (bot.botListeners.ignored.channels.has(message.channel.id))
                return;
            if (!bot.botListeners.size)
                return;
            function safeSend(...args) {
                const lines = [...args];
                const lastArg = util_1.isObject(lines[lines.length - 1]) ? lines.pop() : undefined;
                const msg = bot.lines(...lines, typeof lastArg === 'string' ? lastArg : '');
                return channel()
                    .send(msg, lastArg)
                    .then((sentMessage) => {
                    var _a, _b, _c;
                    if (((_a = bot) === null || _a === void 0 ? void 0 : _a.logger) && ((_b = sentMessage === null || sentMessage === void 0 ? void 0 : sentMessage.guild) === null || _b === void 0 ? void 0 : _b.name)) {
                        (_c = bot) === null || _c === void 0 ? void 0 : _c.logger.debug('Sending listener message to guild:', sentMessage.guild.name);
                    }
                })
                    .catch((err) => {
                    var _a, _b;
                    err.stack += `\n\nGuild: ${(_a = message.guild) === null || _a === void 0 ? void 0 : _a.name}\n`;
                    err.stack += `Channel: ${(_b = message.channel) === null || _b === void 0 ? void 0 : _b.id}\n`;
                    bot.emit('error', err);
                });
            }
            const entries = Object.entries(this.mappedListeners);
            const runListenersInCategory = (listenersInThisCategory) => __awaiter(this, void 0, void 0, function* () {
                for (const listener of listenersInThisCategory) {
                    listener.send = (...args) => safeSend(...args);
                    let result;
                    try {
                        const meta = command_1.buildCommandMetadata(bot, message, '');
                        if (extensions.metaExtenders.length) {
                            for (const extension of extensions.metaExtenders) {
                                try {
                                    const extended = extension(meta);
                                    if (extended instanceof Promise) {
                                        yield extended;
                                    }
                                }
                                catch (err) {
                                    err.message = 'A meta extension function threw an error.\n\n' + err.message;
                                    bot.emit('error', err);
                                    return;
                                }
                            }
                        }
                        const evaluation = listener.evaluate(message, meta);
                        result = evaluation instanceof Promise ? yield evaluation : evaluation;
                    }
                    catch (e) {
                        this.bot.emit('error', e);
                        break;
                    }
                    if (result === true) {
                        break;
                    }
                }
            });
            const runAllListeners = () => {
                for (const [category, listenersInThisCategory] of entries) {
                    runListenersInCategory(listenersInThisCategory).catch((err) => console.log(category, err));
                }
            };
            runAllListeners();
        });
    }
}
exports.ListenerRunner = ListenerRunner;
