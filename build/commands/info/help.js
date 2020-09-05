"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const modules_1 = require("../../modules");
const interfaces_1 = require("../../interfaces");
exports.default = new modules_1.Command({
    name: 'help',
    description: 'Let me help you!',
    category: 'info',
    permission: interfaces_1.Permission.USER,
    runIn: ['text', 'dm'],
    usage: '[command name]',
    examples: [' ', 'info', 'ping'],
    run(bot, message, meta) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const { args } = meta;
        if (args[0]) {
            const search = args[0].toLowerCase();
            const command = bot.commands.get(search) || bot.commands.get(bot.aliases.get(search) || '');
            if (!command || (command.hidden && bot.permlevel(message) < 8)) {
                return this.send(`I could not find the ${search} command.`);
            }
            const embed = new discord_js_1.MessageEmbed({
                author: {
                    name: command.name.toUpperCase(),
                    iconURL: (_a = message.author.avatarURL()) !== null && _a !== void 0 ? _a : undefined,
                },
                footer: {
                    text: `Version ${bot.version} <3`,
                    iconURL: ((_b = bot.user) === null || _b === void 0 ? void 0 : _b.avatarURL()) || undefined,
                },
            });
            embed.addField(':blue_book: Description', command.description);
            if ((_d = (_c = command.aliases) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0 > 0) {
                embed.addField(':books: Aliases', command.aliases.reduce((acc, cur) => `${acc} \`${cur}\``, ''));
            }
            if (command.usage) {
                embed.addField(':book: Usage', `\`\`\`${meta.prefix}${command.name} ${command.usage}\`\`\`` +
                    '```python\n' +
                    '# Remove the brackets.\n' +
                    '# {} = Required arguments\n' +
                    '# [] = Optional arguments.```');
            }
            const addExamples = (exampleType) => {
                const start = `${bot.config.defaultSettings.prefix}${command.name} `;
                const example = command[exampleType];
                const isArr = Array.isArray(example);
                const examples = isArr
                    ? example.reduce((acc, cur) => `${acc} \`\`\`${start}${cur}\`\`\``, '')
                    : `\`\`\`${start}${example}\`\`\``;
                embed.addField(':ledger: Example', examples);
            };
            if ((_e = command.examples) === null || _e === void 0 ? void 0 : _e.length) {
                addExamples('examples');
            }
            return this.send({ embed });
        }
        const botName = (_g = (_f = bot.user) === null || _f === void 0 ? void 0 : _f.username) !== null && _g !== void 0 ? _g : 'Bot';
        const embed = new discord_js_1.MessageEmbed({
            author: {
                name: `${botName} Help`,
                iconURL: (_h = message.author.avatarURL()) !== null && _h !== void 0 ? _h : undefined,
            },
            footer: {
                text: `Version ${bot.version} <3`,
                icon_url: (_k = (_j = bot.user) === null || _j === void 0 ? void 0 : _j.avatarURL()) !== null && _k !== void 0 ? _k : undefined,
            },
            description: `These are the commands available for ${botName}.\n` +
                'To learn more about a command use `' +
                meta.prefix +
                'help {command name}`',
        });
        const commandList = {};
        bot.commands.forEach(c => {
            commandList[c.category || 'other'] = [
                ...(commandList[c.category || 'other'] || []),
                c,
            ];
        });
        const cats = Object.keys(commandList);
        cats.sort((a, b) => a.localeCompare(b));
        cats.forEach(category => {
            embed.addField(`${(bot.config.helpCategoryEmotes || {})[category] || ':page_facing_up:'} ${category}`, '>' +
                commandList[category]
                    .filter((c) => !c.hidden)
                    .sort((a, b) => a < b)
                    .reduce((acc, cur) => `${acc} \`${cur.name}\``, ''));
        });
        return this.send({ embed });
    },
});
