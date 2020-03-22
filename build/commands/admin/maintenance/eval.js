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
const modules_1 = require("../../../modules");
exports.default = new modules_1.Command({
    name: 'eval',
    description: 'Troubleshooting command.',
    permission: modules_1.Command.Permission.BOT_OWNER,
    hidden: true,
    category: 'maintenance',
    run(bot, message, meta) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content } = meta;
            try {
                const evaled = eval(content);
                const clean = yield bot.clean(evaled);
                message.channel.send(`\`\`\`js\n${clean}\n\`\`\``, { split: true });
            }
            catch (err) {
                message.channel.send(`\`ERROR\` \`\`\`xl\n${yield bot.clean(err)}\n\`\`\``, {
                    split: true,
                });
            }
        });
    },
});
