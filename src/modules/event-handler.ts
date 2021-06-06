import { ClientEvents } from 'discord.js';
import { SensumSchemaError } from '../errors';
import { IBotClient } from '../interfaces';

export class EventHandler<K extends keyof ClientEvents> {
  name: string;
  run: SensumEventHandler<K>;
  enabled: boolean;

  constructor({
    name,
    run,
    enabled = true,
  }: {
    name: K;
    run: SensumEventHandler<K>;
    enabled: boolean;
  }) {
    if (!name) throw new SensumSchemaError('Missing event name.');
    if (!run || typeof run !== 'function')
      throw new SensumSchemaError('You must set a run function.');

    this.name = name;
    this.run = run;
    this.enabled = enabled;
  }

  toggle() {
    this.enabled = !this.enabled;
  }
}

export type SensumEventHandler<K extends keyof ClientEvents> = (
  bot: IBotClient,
  ...args: ClientEvents[K]
) => void;

export const wrapEventHandler =
  (bot: IBotClient, handler: any) =>
  (...args: any[]) => {
    if (handler.enabled) {
      handler.run(bot, ...args);
    }
  };
