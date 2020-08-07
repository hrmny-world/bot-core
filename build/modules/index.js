"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
var command_1 = require("./command");
Object.defineProperty(exports, "Command", { enumerable: true, get: function () { return command_1.Command; } });
Object.defineProperty(exports, "CooldownManager", { enumerable: true, get: function () { return command_1.CooldownManager; } });
Object.defineProperty(exports, "buildCommandMetadata", { enumerable: true, get: function () { return command_1.buildCommandMetadata; } });
Object.defineProperty(exports, "splitArguments", { enumerable: true, get: function () { return command_1.splitArguments; } });
Object.defineProperty(exports, "validatePrefix", { enumerable: true, get: function () { return command_1.validatePrefix; } });
exports.FileLoader = __importStar(require("./file-loader"));
__exportStar(require("./channel-watcher"), exports);
