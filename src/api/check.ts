import * as express from 'express';

import { IBotClient } from '../interfaces';

export const check = (bot: IBotClient, req: express.Request, res: express.Response) => {
  return res.json({
    name: 'Hrmny Bot',
    version: 'v' + bot.version,
    userCount: bot.userCount,
  });
};
