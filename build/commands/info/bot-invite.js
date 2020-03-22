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
const modules_1 = require("../../modules");
const interfaces_1 = require("../../interfaces");
const discord_js_1 = require("discord.js");
exports.default = new modules_1.Command({
    name: 'invite',
    description: 'Generates an invite for Hrmny.',
    aliases: ['inviteme'],
    category: 'info',
    permission: interfaces_1.Permission.USER,
    run(bot) {
        return __awaiter(this, void 0, void 0, function* () {
            const invite = yield bot.generateInvite(discord_js_1.Permissions.ALL);
            this.send("I'm so happy you want to invite me c:", invite);
        });
    },
});
