"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (bot, message) => {
    bot.channelWatchers.forEach(watcher => {
        if (watcher.channelId === message.channel.id) {
            watcher._channelEventHappened('messageDelete', { message, channel: message.channel });
        }
    });
};
