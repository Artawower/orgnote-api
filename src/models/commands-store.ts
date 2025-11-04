import { Ref } from 'vue';
import { Command, CommandCallback } from './command';
import { Store } from './store';
import { Nullable } from '../types/nullable';

export type CommandUnsubscribFn = () => void;

export interface CommandsStore {
  add: (...newCommands: Command[]) => void;
  remove: (...commandsToUnregister: Command[]) => void;
  get: (name: string) => Nullable<Command>;
  commands: Ref<Command[]>;
  execute: (name: string, data?: unknown) => Promise<void>;
  afterExecute: (
    commandNames: string | string[],
    callback: CommandCallback
  ) => CommandUnsubscribFn;
}

export type CommandsStoreDefinition = Store<CommandsStore>;
