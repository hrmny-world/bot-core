"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersonName = void 0;
const discord_js_1 = require("discord.js");
const bot_client_1 = require("../bot-client");
function getPersonName(search, client) {
    var _a, _b, _c;
    if (!search)
        return null;
    if (search instanceof discord_js_1.Message) {
        return getPersonName((_a = search.member) !== null && _a !== void 0 ? _a : search.author);
    }
    if (search instanceof discord_js_1.GuildMember) {
        return (_b = search.nickname) !== null && _b !== void 0 ? _b : search.user.username;
    }
    if (search instanceof discord_js_1.User) {
        return search.username;
    }
    if (typeof search === 'string' && client instanceof bot_client_1.BotClient) {
        return (_c = getPersonName(client.users.cache.get(search))) !== null && _c !== void 0 ? _c : null;
    }
    return null;
}
exports.getPersonName = getPersonName;
