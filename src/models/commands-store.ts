import { Ref } from 'vue';
import { Command } from './command';
import { Store } from './store';

export interface CommandsStore {
  register: (...newCommands: Command[]) => void;
  unregister: (...commandsToUnregister: Command[]) => void;
  getCommand: (name: string) => Command | undefined;
  // TODO: use Ref type when it possible
  commands: Ref<Command[]>;
}

export type CommandsStoreDefinition = Store<CommandsStore>;
