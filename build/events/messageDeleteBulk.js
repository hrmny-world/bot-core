"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (bot, messages) => {
    const channel = messages.first().channel;
    bot.channelWatchers.forEach(watcher => {
        if (watcher.channelId === channel.id) {
            watcher._channelEventHappened('messageDelete', { messages, channel });
        }
    });
};
