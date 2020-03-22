"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const check_1 = require("./api/check");
const vote_webhook_1 = require("./api/vote-webhook");
exports.webServer = (bot) => {
    const app = express_1.default();
    app.use(body_parser_1.default.json());
    app.get('/', check_1.check.bind(null, bot));
    app.post('/vote-webhook', vote_webhook_1.voteWebhook.bind(null, bot));
    const server = app.listen(bot.config.apiport, () => { });
    return server;
};
