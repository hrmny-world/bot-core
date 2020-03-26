"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (bot, reaction, user) => {
    bot.channelWatchers.forEach(watcher => {
        const channel = reaction.message.channel;
        if (channel.id !== watcher.channelId)
            return;
        watcher._channelEventHappened('messageReactionRemove', { channel, reaction, user });
    });
};
