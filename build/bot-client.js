"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.BotClient = void 0;
const util_1 = require("util");
const discord_js_1 = require("discord.js");
const collection_1 = __importDefault(require("@discordjs/collection"));
const modules_1 = require("./modules");
const message_1 = require("./events/message");
const events = __importStar(require("./events"));
class BotClient extends discord_js_1.Client {
    constructor(config, options = { disableMentions: 'everyone' }) {
        super(options);
        this.wait = util_1.promisify(setTimeout);
        this.randInt = (min, max) => Math.floor(Math.random() * (+max - +min)) + +min;
        this.colorInt = (hexIn) => parseInt(hexIn.split('#')[1], 16);
        this.lines = (...lines) => {
            if (!lines || !lines.length) {
                return '';
            }
            if (lines.length === 1) {
                return String(lines[0]).trim();
            }
            return lines.reduce((all, current) => `${all}\n${String(current).trim()}`, '').trim();
        };
        this.appendMsg = (msg, content, delay = 0) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.wait(delay);
                msg = yield (msg === null || msg === void 0 ? void 0 : msg.edit(`${msg === null || msg === void 0 ? void 0 : msg.content}${content}`));
            }
            catch (_a) { }
            return msg;
        });
        this.getChannelsInMessage = (message) => __awaiter(this, void 0, void 0, function* () {
            const channelMentionRegex = /(?<=<#)(\d+?)(?=>)/g;
            const channelsInMessage = message.content.match(channelMentionRegex) || [];
            if (!message.guild)
                return [];
            if (channelsInMessage.length === 0)
                return [];
            const channelsInGuild = message.guild.channels.cache.filter((c) => c.type === 'text');
            const channels = channelsInMessage
                .filter((v, i, a) => a.indexOf(v) === i)
                .map((channelId) => channelsInGuild.get(channelId))
                .filter((c) => c !== undefined);
            return channels;
        });
        this.clean = (text) => __awaiter(this, void 0, void 0, function* () {
            if (text && text.constructor.name == 'Promise')
                text = yield text;
            if (typeof text !== 'string')
                text = util_1.inspect(text, { depth: 1 });
            text = text
                .replace(/`/g, '`' + String.fromCharCode(8203))
                .replace(/@/g, '@' + String.fromCharCode(8203))
                .replace(this.config.token, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');
            return text;
        });
        this.permlevel = (message) => {
            let permlvl = 0;
            const permOrder = this.config.permLevels.slice(0).sort((p, c) => (p.level < c.level ? 1 : -1));
            while (permOrder.length) {
                const currentLevel = permOrder.shift();
                if (message.guild && currentLevel.guildOnly)
                    continue;
                if (currentLevel.check(message)) {
                    permlvl = currentLevel.level;
                    break;
                }
            }
            return permlvl;
        };
        this.helpers = {
            wait: this.wait,
            randInt: this.randInt,
            colorInt: this.colorInt,
            getChannelsInMessage: this.getChannelsInMessage,
            lines: this.lines,
            appendMsg: this.appendMsg,
        };
        this.extend = {
            prefixChecking: (checker) => {
                this.extensions.prefixCheckers.push(checker);
            },
            metaParsing: (extender) => {
                this.extensions.metaExtenders.push(extender);
            },
        };
        this.config = config;
        this.commands = new collection_1.default();
        this.aliases = new collection_1.default();
        this.cooldowns = new modules_1.CooldownManager(this);
        this.botListeners = new collection_1.default();
        this._listenerRunner = undefined;
        this.channelWatchers = new collection_1.default();
        const permLevelCache = {};
        for (let i = 0; i < this.config.permLevels.length; i++) {
            const thisLevel = this.config.permLevels[i];
            permLevelCache[thisLevel.name] = thisLevel.level;
        }
        this.permLevelCache = permLevelCache;
        this.extensions = {
            metaExtenders: [],
            prefixCheckers: [],
        };
    }
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
        return process.env.npm_package_version;
    }
    loadCommand(command) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.emit('debug', `Loading Command: ${command.name}`);
                if (command.init) {
                    command.init(this);
                }
                this.commands.set(command.name, command);
                this.cooldowns.set(command.name.toLowerCase(), new collection_1.default());
                (_a = command.aliases) === null || _a === void 0 ? void 0 : _a.forEach((alias) => {
                    this.aliases.set(alias, command.name);
                });
            }
            catch (e) {
                this.emit('error', new Error(`Unable to load command ${command.name}: ${e}`));
            }
        });
    }
    _loadCommandsIntoClient() {
        return __awaiter(this, void 0, void 0, function* () {
            const { root, debug, useTypescript } = this.config;
            const cmdFiles = yield modules_1.FileLoader.loadDirectory({
                ImportClass: modules_1.Command,
                dir: 'commands',
                root,
                debug,
                useTypescript,
            });
            yield Promise.all([...cmdFiles.map((cmd) => this.loadCommand(cmd))]);
        });
    }
    _loadListenersIntoClient() {
        return __awaiter(this, void 0, void 0, function* () {
            const { root, debug, useTypescript } = this.config;
            const listenerFiles = yield modules_1.FileLoader.loadDirectory({
                ImportClass: modules_1.Listener,
                dir: 'listeners',
                root,
                debug,
                useTypescript,
            });
            const makeName = (words) => {
                return Array.isArray(words) ? words.join(' ').toLowerCase() : words.toLowerCase();
            };
            const mappedListeners = listenerFiles.map((l) => {
                return [
                    makeName(l.words),
                    Object.assign(l, { name: makeName(l.words) }),
                ];
            });
            const listeners = new collection_1.default(mappedListeners);
            listeners.ignored = new modules_1.ListenerIgnoreList(this);
            this.botListeners = listeners;
        });
    }
    _loadEventsIntoClient() {
        return __awaiter(this, void 0, void 0, function* () {
            const { root, debug, useTypescript } = this.config;
            const evtFiles = yield modules_1.FileLoader.readDirectory({
                dir: 'events',
                root,
                debug,
                useTypescript,
            });
            evtFiles.forEach((filePath) => {
                const splits = filePath.split(/(\/|\\)/g);
                const eventName = splits[splits.length - 1].split('.')[0];
                const requiredEventModule = module.require(filePath.replace(__dirname, './'));
                let event;
                if (requiredEventModule && typeof requiredEventModule === 'function') {
                    event = requiredEventModule;
                }
                else if (requiredEventModule && typeof requiredEventModule.default === 'function') {
                    event = requiredEventModule.default;
                }
                if (event) {
                    this.on(eventName, event.bind(null, this));
                }
            });
        });
    }
    login(token) {
        const _super = Object.create(null, {
            login: { get: () => super.login }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this._loadCommandsIntoClient();
            yield this._loadEventsIntoClient();
            this.cooldowns.loadCommands(this.commands);
            this.on('message', message_1.commandRunner(this.extensions, this));
            yield this._loadListenersIntoClient();
            this._listenerRunner = new modules_1.ListenerRunner(this, {});
            this._listenerRunner.listen(this.extensions);
            for (const [eventName, eventHandler] of Object.entries(events)) {
                this.on(eventName, eventHandler.bind(null, this));
            }
            return _super.login.call(this, token);
        });
    }
}
exports.BotClient = BotClient;
