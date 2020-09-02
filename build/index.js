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
exports.defaultCommands = exports.BotClient = exports.ChannelWatcher = exports.validatePrefix = exports.splitArguments = exports.buildCommandMetadata = exports.FileLoader = exports.CooldownManager = exports.Command = exports.Permission = void 0;
__exportStar(require("./helpers"), exports);
var interfaces_1 = require("./interfaces");
Object.defineProperty(exports, "Permission", { enumerable: true, get: function () { return interfaces_1.Permission; } });
__exportStar(require("./bot.config"), exports);
var modules_1 = require("./modules");
Object.defineProperty(exports, "Command", { enumerable: true, get: function () { return modules_1.Command; } });
Object.defineProperty(exports, "CooldownManager", { enumerable: true, get: function () { return modules_1.CooldownManager; } });
Object.defineProperty(exports, "FileLoader", { enumerable: true, get: function () { return modules_1.FileLoader; } });
Object.defineProperty(exports, "buildCommandMetadata", { enumerable: true, get: function () { return modules_1.buildCommandMetadata; } });
Object.defineProperty(exports, "splitArguments", { enumerable: true, get: function () { return modules_1.splitArguments; } });
Object.defineProperty(exports, "validatePrefix", { enumerable: true, get: function () { return modules_1.validatePrefix; } });
Object.defineProperty(exports, "ChannelWatcher", { enumerable: true, get: function () { return modules_1.ChannelWatcher; } });
var bot_client_1 = require("./bot-client");
Object.defineProperty(exports, "BotClient", { enumerable: true, get: function () { return bot_client_1.BotClient; } });
var commands_1 = require("./commands");
Object.defineProperty(exports, "defaultCommands", { enumerable: true, get: function () { return __importDefault(commands_1).default; } });
