import { Ref } from 'vue';
import { Command, CommandGroup } from './command';
import { CommandsStore } from './commands-store';
import { Store } from './store';

export interface CommandsGroupStore {
  activateGroup: (group: CommandGroup) => void;
  deactivateGroup: (group: CommandGroup) => void;
  getCommandsFromGroup: (group: CommandGroup) => Command[];
  currentGroupsCommands: Ref<Command[]>;
  currentGroups: Ref<CommandGroup[]>;
}

export type CommandsGroupStoreDefinition = Store<CommandsStore>;
