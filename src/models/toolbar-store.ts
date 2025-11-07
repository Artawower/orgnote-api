import type { Ref } from 'vue';
import { StoreDefinition } from './store';
import { CommandName } from './command';

export interface ToolbarStore {
  commands: Ref<CommandName[]>;
  addCommand: (command: CommandName) => void;
  removeCommand: (command: CommandName) => void;
}

export type ToolbarStoreDefinition = StoreDefinition<ToolbarStore>;
