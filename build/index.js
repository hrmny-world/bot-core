"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCommands = exports.BotClient = exports.Permission = void 0;
__exportStar(require("./helpers"), exports);
var interfaces_1 = require("./interfaces");
Object.defineProperty(exports, "Permission", { enumerable: true, get: function () { return interfaces_1.Permission; } });
__exportStar(require("./bot.config"), exports);
__exportStar(require("./modules"), exports);
var bot_client_1 = require("./bot-client");
Object.defineProperty(exports, "BotClient", { enumerable: true, get: function () { return bot_client_1.BotClient; } });
var commands_1 = require("./commands");
Object.defineProperty(exports, "defaultCommands", { enumerable: true, get: function () { return __importDefault(commands_1).default; } });
