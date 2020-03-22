"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const moment_1 = __importDefault(require("moment"));
require("moment-duration-format");
const modules_1 = require("../../modules");
const interfaces_1 = require("../../interfaces");
exports.default = new modules_1.Command({
    name: 'info',
    description: 'Shows some info about Hrmny.',
    permission: interfaces_1.Permission.USER,
    category: 'info',
    aliases: ['stats', 'version'],
    run(bot) {
        var _a, _b, _c;
        const guilds = bot.guilds.cache.size;
        const users = bot.userCount;
        const ping = Math.trunc(bot.ws.ping);
        const version = bot.version;
        const uptime = moment_1.default
            .duration((_a = bot.uptime) !== null && _a !== void 0 ? _a : 0)
            .format(' D [days], H [hrs], m [mins], s [secs]');
        const embedData = {
            color: bot.colorInt('#00ff00'),
            footer: {
                text: `Version ${version} - ${moment_1.default().format('YYYY-MM-DD HH:mm:ss')}`,
            },
            thumbnail: {
                url: (_c = (_b = bot.user) === null || _b === void 0 ? void 0 : _b.avatarURL()) !== null && _c !== void 0 ? _c : undefined,
            },
            author: {
                name: 'Hrmny Stats 🍃',
            },
        };
        const embed = new discord_js_1.MessageEmbed(embedData);
        embed.addField('Servers', guilds, true);
        embed.addField('Users', users, true);
        embed.addField('Uptime', uptime, false);
        embed.addField('Ping', ping + 'ms', true);
        this.send({ embed });
    },
});
