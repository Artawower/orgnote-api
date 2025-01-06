import { Ref } from 'vue';
import { Command } from './command';
import { Store } from './store';

export interface CommandsStore {
  add: (...newCommands: Command[]) => void;
  remove: (...commandsToUnregister: Command[]) => void;
  get: (name: string) => Command | undefined;
  commands: Ref<Command[]>;
}

export type CommandsStoreDefinition = Store<CommandsStore>;
