"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = void 0;
exports.check = (bot, req, res) => {
    return res.json({
        name: 'Hrmny Bot',
        version: 'v' + bot.version,
        userCount: bot.userCount,
    });
};
