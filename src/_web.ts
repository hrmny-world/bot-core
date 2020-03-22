import express from 'express';
import bodyParser from 'body-parser';

import { check } from './api/check';
import { voteWebhook } from './api/vote-webhook';
import { BotClient } from './bot-client';

export const webServer = (bot: BotClient) => {
  const app = express();
  app.use(bodyParser.json());
  app.get('/', check.bind(null, bot));
  app.post('/vote-webhook', voteWebhook.bind(null, bot));
  const server = app.listen(bot.config.apiport, () =>
    // bot.logger.info(`[Express] Listening on port ${bot.config.apiport}!`),
    {}
  );
  return server;
};
