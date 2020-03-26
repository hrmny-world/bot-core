"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (bot, channel, user) => {
    bot.channelWatchers.forEach(watcher => {
        if (channel.id !== watcher.channelId)
            return;
        watcher._channelEventHappened('message', { channel, user });
    });
};
