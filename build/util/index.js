"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var format_string_1 = require("./format-string");
exports.formatString = format_string_1.default;
var is_object_1 = require("./is-object");
exports.isObject = is_object_1.default;
exports.Emoji = __importStar(require("./emojis"));
exports.time = __importStar(require("./time"));
