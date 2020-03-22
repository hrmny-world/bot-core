import * as express from 'express';
import { IBotClient } from '../interfaces';
export declare const check: (bot: IBotClient, req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response<any>) => express.Response<any>;
