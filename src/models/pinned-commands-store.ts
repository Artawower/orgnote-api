import type { Ref } from 'vue';
import type { StoreDefinition } from './store';
import type { CommandName } from './command';

export type CommandContext =
  | 'sidebar'
  | 'sidebar-footer'
  | 'right-sidebar'
  | 'edit-toolbar'
  | 'editor-actions'
  | ({} & string);

export interface PinnedCommandsStore {
  getCommands: (context: CommandContext) => Ref<CommandName[]>;
  addCommand: (context: CommandContext, command: CommandName) => void;
  removeCommand: (context: CommandContext, command: CommandName) => void;
}

export type PinnedCommandsStoreDefinition =
  StoreDefinition<PinnedCommandsStore>;
