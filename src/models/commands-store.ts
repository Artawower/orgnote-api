import { Ref } from 'vue';
import { Command, CommandCallback } from './command';
import { Store } from './store';

export type CommandUnsubscribFn = () => void;

export interface CommandsStore {
  add: (...newCommands: Command[]) => void;
  remove: (...commandsToUnregister: Command[]) => void;
  get: (name: string) => Command | undefined;
  commands: Ref<Command[]>;
  execute: (name: string, data?: unknown) => Promise<void>;
  afterExecute: (
    commandNames: string | string[],
    callback: CommandCallback
  ) => CommandUnsubscribFn;
}

export type CommandsStoreDefinition = Store<CommandsStore>;
