"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getMentionedChannels(message) {
    const channelRegex = /(?<=<#)(\d+?)(?=>)/g;
    const channelsInMessage = message.content.match(channelRegex) || [];
    if (!message.guild)
        return [];
    if (channelsInMessage.length === 0)
        return [];
    const channelsInGuild = message.guild.channels.cache.filter(c => c.type === 'text');
    const channels = channelsInMessage
        .filter((v, i, a) => a.indexOf(v) === i)
        .map(c => channelsInGuild.get(c))
        .filter(c => c !== undefined);
    return channels;
}
exports.getMentionedChannels = getMentionedChannels;
