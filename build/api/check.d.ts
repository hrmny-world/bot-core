import * as express from 'express';
import { IBotClient } from '../interfaces';
export declare const check: (bot: IBotClient, req: express.Request, res: express.Response) => express.Response<any>;
