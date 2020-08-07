"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteWebhook = void 0;
exports.voteWebhook = (bot, req, res) => {
    const auth = req.get('Authorization');
    if (!auth || auth !== process.env.VOTE_WEBHOOK_PASS) {
        res.status(403).json({ message: 'Authentication Failed' });
        return;
    }
    bot.emit('vote', req.body);
    res.json({ message: 'ok' });
};
