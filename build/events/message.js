"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandRunner = void 0;
const __1 = require("..");
const util_1 = require("../util");
exports.commandRunner = (extensions, bot) => (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    bot.setImmediate(() => {
        bot.channelWatchers.forEach(watcher => {
            if (message.channel.id !== watcher.channelId)
                return;
            watcher._channelEventHappened('message', { message, channel: message.channel });
        });
    });
    if (message.author.bot)
        return;
    let prefix = false;
    if (extensions.prefixCheckers.length) {
        for (const check of extensions.prefixCheckers) {
            try {
                prefix = check(bot, message);
                if (prefix instanceof Promise) {
                    prefix = yield prefix;
                }
            }
            catch (err) {
                err.message = 'A prefix check function threw an error.\n\n' + err.message;
                bot.emit('error', err);
                return;
            }
            if (!prefix)
                return;
        }
    }
    else {
        prefix = __1.validatePrefix(message, bot.config.defaultSettings.prefix);
    }
    if (!prefix) {
        return;
    }
    const meta = __1.buildCommandMetadata(bot, message, prefix);
    if (extensions.metaExtenders.length) {
        for (const extension of extensions.metaExtenders) {
            try {
                const extended = extension(meta);
                if (extended instanceof Promise) {
                    yield extended;
                }
            }
            catch (err) {
                err.message = 'A meta extension function threw an error.\n\n' + err.message;
                bot.emit('error', err);
                return;
            }
        }
    }
    if (!meta.isDM && !message.member)
        yield ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.fetch({ user: message.author }));
    if (!meta.command)
        return;
    if (meta.isDM && !((_b = meta.command.runIn) === null || _b === void 0 ? void 0 : _b.includes('dm'))) {
        try {
            yield message.channel.send('This command is unavailable via private message. Please run this command in a server.');
        }
        catch (_g) {
        }
    }
    if (!meta.isDM &&
        !(((_c = meta.command.runIn) === null || _c === void 0 ? void 0 : _c.includes('text')) || ((_d = meta.command.runIn) === null || _d === void 0 ? void 0 : _d.includes('guild')))) {
        try {
            yield message.channel.send('This command is only available via private message. Please run this command in a DM.');
        }
        catch (_h) {
        }
    }
    const requiredPermLevel = bot.config.permLevels.find((l) => l.level === meta.command.permission);
    const userPermLevel = bot.config.permLevels.find((l) => l.level === meta.permLevel);
    if (meta.permLevel < meta.command.permission) {
        if (!requiredPermLevel) {
            bot.emit('error', new Error(`Permission level ${meta.command.permission} in command ${meta.command.name} not found in the config!`));
            return;
        }
        const sendNoPermissionMessage = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield message.channel.send(bot.lines('You do not have permission to use this command.', `Your permission level is ${meta.permLevel} (${userPermLevel.name})`, `This command requires level ${requiredPermLevel.level} (${requiredPermLevel.name})`));
            }
            catch (_m) {
            }
        });
        return ((_e = meta.command.hidden) !== null && _e !== void 0 ? _e : sendNoPermissionMessage());
    }
    if (meta.missingArg) {
        try {
            message.channel.send(util_1.formatString(bot.config.messages.USAGE, meta.missingArg, `\`${prefix}${meta.commandName} ${meta.command.usage || ((_f = meta.command.requiredArgs) === null || _f === void 0 ? void 0 : _f.map(a => `{${a}}`).join(' '))}\``));
        }
        catch (_j) {
        }
        return;
    }
    const cooldownLeft = bot.cooldowns.getTimeLeft(meta.commandName, meta.userId);
    if (cooldownLeft > 0) {
        try {
            yield message.channel.send(util_1.formatString(bot.config.messages.COOLDOWN, util_1.time.secondsToHumanReadable(cooldownLeft), meta.commandName));
        }
        catch (_k) {
        }
        return;
    }
    bot.cooldowns.updateTimeLeft(meta.commandName, meta.userId);
    if (meta.command.delete) {
        try {
            yield message.delete({ reason: `Executed the ${meta.commandName} command.` });
        }
        catch (_l) {
        }
    }
    const safeSend = (...args) => {
        const lines = [...args];
        const lastArg = lines.pop();
        const msg = bot.helpers.lines(...lines, typeof lastArg === 'string' ? lastArg : '');
        return message.channel.send(msg, util_1.isObject(lastArg) ? lastArg : undefined).catch(err => {
            var _a, _b;
            const channelName = message.channel.name;
            const channelId = message.channel.id;
            const guildName = (_a = meta.guild) === null || _a === void 0 ? void 0 : _a.name;
            const guildId = (_b = meta.guild) === null || _b === void 0 ? void 0 : _b.id;
            bot.emit('warn', bot.helpers.lines(`Could not send message.`, `Channel: ${channelName} (${channelId})`, `Guild: ${guildName} (${guildId})`, `DM: ${meta.isDM}`, `Error: ${err.message}`));
        });
    };
    meta.command.send = safeSend;
    bot.emit('command', meta);
    const safelyRun = (subject, errorHandler) => {
        try {
            subject().catch(errorHandler);
        }
        catch (err) {
            if (err instanceof TypeError && /catch/.test(err.message)) {
            }
            else {
                errorHandler(err);
            }
        }
    };
    const errorHandler = (err) => {
        var _a, _b, _c;
        const channelName = message.channel.name;
        const channelId = message.channel.id;
        const guildName = (_a = meta.guild) === null || _a === void 0 ? void 0 : _a.name;
        const guildId = (_b = meta.guild) === null || _b === void 0 ? void 0 : _b.id;
        const errorMsg = (_c = err.stack) === null || _c === void 0 ? void 0 : _c.replace(new RegExp(`${__dirname}/`, 'g'), './');
        err.stack =
            `An error ocurred in the ${meta.commandName} command.\n` +
                bot.helpers.lines(`Could not send message.`, `Channel: ${channelName} (${channelId})`, `Guild: ${guildName} (${guildId})`, `DM: ${meta.isDM}`, errorMsg) +
                err.stack;
        bot.emit('error', err);
    };
    safelyRun(() => { var _a; return (_a = meta.command) === null || _a === void 0 ? void 0 : _a.run(bot, message, meta); }, errorHandler);
});
