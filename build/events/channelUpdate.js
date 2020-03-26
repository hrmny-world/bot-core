"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (bot, oldChannel, newChannel) => {
    bot.channelWatchers.forEach(watcher => {
        if (oldChannel.id !== watcher.channelId)
            return;
        watcher._channelEventHappened('channelUpdate', { oldChannel, newChannel });
    });
};
