"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var command_1 = require("./command");
exports.Command = command_1.Command;
exports.CooldownManager = command_1.CooldownManager;
exports.buildCommandMetadata = command_1.buildCommandMetadata;
exports.splitArguments = command_1.splitArguments;
exports.validatePrefix = command_1.validatePrefix;
exports.FileLoader = __importStar(require("./file-loader"));
__export(require("./channel-watcher"));
