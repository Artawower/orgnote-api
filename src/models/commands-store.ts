import { Ref } from 'vue';
import { Command, CommandCallback } from './command';
import { StoreDefinition } from './store';

export type CommandUnsubscribFn = () => void;

export interface ExecuteCommandOptions {
  interactive?: boolean;
}

export interface CommandsStore {
  add: (...newCommands: Command[]) => void;
  remove: (...commandsToUnregister: Command[]) => void;
  get: (name: string) => Command | undefined;
  commands: Ref<Command[]>;
  execute: (
    name: string,
    data?: unknown,
    options?: ExecuteCommandOptions
  ) => Promise<void>;
  afterExecute: (
    commandNames: string | string[],
    callback: CommandCallback
  ) => CommandUnsubscribFn;
}

export type CommandsStoreDefinition = StoreDefinition<CommandsStore>;
