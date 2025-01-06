import { Ref } from 'vue';
import { Command, CommandGroup } from './command';
import { Store } from './store';

export interface CommandsGroupStore {
  activateGroup: (group: CommandGroup) => void;
  deactivateGroup: (group: CommandGroup) => void;
  getCommandsByGroup: (group: CommandGroup) => Command[];
  currentGroupsCommands: Ref<Command[]>;
  currentGroups: Ref<CommandGroup[]>;
}

export type CommandsGroupStoreDefinition = Store<CommandsGroupStore>;
