import { BotClient, IBotMessage } from '..';
import { CombinedMeta } from '../interfaces';
export declare type IPrefixChecker = (bot: BotClient, message: IBotMessage) => string | false;
export declare type IMetaExtender = <T>(meta: CombinedMeta<T>) => void | Promise<void>;
export interface ICommandExtenders {
    prefixCheckers: IPrefixChecker[];
    metaExtenders: IMetaExtender[];
}
export declare const commandRunner: (extensions: ICommandExtenders, bot: BotClient) => (message: IBotMessage) => Promise<boolean | void>;
