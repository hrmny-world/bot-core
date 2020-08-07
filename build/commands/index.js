"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ping = exports.info = exports.help = exports.botInvite = exports.repeat = exports.eval = void 0;
const eval_1 = __importDefault(require("./admin/maintenance/eval"));
exports.eval = eval_1.default;
const repeat_1 = __importDefault(require("./admin/maintenance/repeat"));
exports.repeat = repeat_1.default;
const bot_invite_1 = __importDefault(require("./info/bot-invite"));
exports.botInvite = bot_invite_1.default;
const help_1 = __importDefault(require("./info/help"));
exports.help = help_1.default;
const info_1 = __importDefault(require("./info/info"));
exports.info = info_1.default;
const ping_1 = __importDefault(require("./info/ping"));
exports.ping = ping_1.default;
exports.default = [eval_1.default, repeat_1.default, bot_invite_1.default, help_1.default, info_1.default, ping_1.default];
