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
const events_1 = require("events");
const collection_1 = __importDefault(require("@discordjs/collection"));
const deep_object_diff_1 = require("deep-object-diff");
class ChannelWatcher extends events_1.EventEmitter {
    constructor(bot, guildId, channelId) {
        super();
        this.bot = bot;
        this.guildId = guildId;
        this.channelId = channelId;
        this.ready = false;
        this.fetchChannel();
    }
    _channelEventHappened(event, data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            switch (event) {
                case 'channelDelete':
                    this.emit('deleted', { channel: data.channel });
                    this.destroy();
                    break;
                case 'channelPinsUpdate':
                    const channel = data.channel;
                    const newPins = (yield channel.messages.fetchPinned());
                    this.emit('pins', { oldPins: (_a = this.oldPins) !== null && _a !== void 0 ? _a : new collection_1.default(), newPins });
                    this.latestState = data.channel;
                    this.oldPins = newPins;
                    break;
                case 'channelUpdate':
                    const difference = deep_object_diff_1.diff(data.oldChannel, data.newChannel);
                    this.emit('update', difference);
                    break;
                case 'messageDelete':
                    this.emit('message-delete', data);
                    break;
                case 'messageDeleteBulk':
                    this.emit('message-delete', data);
                    break;
                case 'messageReactionAdd':
                    this.emit('reaction-add', data);
                    break;
                case 'messageReactionRemove':
                    this.emit('reaction-remove', data);
                    break;
                case 'messageReactionRemoveAll':
                    this.emit('reaction-remove-all', data);
                    break;
                case 'message':
                    this.emit('message', data);
                    break;
                case 'typingStart':
                    this.emit('typing', data);
                    break;
                default:
                    this.bot.emit('warn', `Weird event sent to _channelEventHappened of ${this.guildId}:${this.channelId} => ${event}`);
                    return;
            }
        });
    }
    fetchChannel() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield this.bot.channels.fetch(this.channelId);
            if (!channel) {
                throw new Error(`Channel ${this.channelId} of guild ${this.guildId} not found`);
            }
            this.latestState = channel;
            this.type = channel.type;
            this.oldPins = (_b = (yield ((_a = channel.messages) === null || _a === void 0 ? void 0 : _a.fetchPinned()))) !== null && _b !== void 0 ? _b : Promise.resolve(undefined);
            if (!this.ready) {
                this.ready = true;
                this.emit('ready');
            }
        });
    }
    destroy() {
        this.bot.channelWatchers.delete(`${this.guildId}:${this.channelId}`);
        this.removeAllListeners();
    }
}
exports.ChannelWatcher = ChannelWatcher;
