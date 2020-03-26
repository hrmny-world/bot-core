"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (bot, message) => {
    bot.channelWatchers.forEach(watcher => {
        const channel = message.channel;
        if (channel.id !== watcher.channelId)
            return;
        watcher._channelEventHappened('messageReactionRemoveAll', { channel, message });
    });
};
