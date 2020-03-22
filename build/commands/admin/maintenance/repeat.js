"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../../modules/command");
const interfaces_1 = require("../../../interfaces");
exports.default = new command_1.Command({
    name: 'repeat',
    description: 'Repeats stuff like a robot',
    category: 'maintenance',
    permission: interfaces_1.Permission.BOT_SUPPORT,
    delete: true,
    run(bot, message, meta) {
        const name = meta.nickname || meta.username;
        const msg = name + ' said ' + meta.content;
        this.send(msg);
        bot.emit('debug', 'REPEAT COMMAND: ' + msg);
    },
});
