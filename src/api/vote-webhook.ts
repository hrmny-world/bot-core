import * as express from 'express';
import { BotClient } from '..';

export const voteWebhook = (bot: BotClient, req: express.Request, res: express.Response) => {
  const auth = req.get('Authorization');
  if (!auth || auth !== process.env.VOTE_WEBHOOK_PASS) {
    res.status(403).json({ message: 'Authentication Failed' });
    return;
  }
  bot.emit('vote', req.body);
  res.json({ message: 'ok' });
};
