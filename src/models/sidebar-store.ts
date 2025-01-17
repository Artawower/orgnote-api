import type { Ref } from 'vue';
import { Store } from './store';
import { ShallowRef } from 'vue';
import { VueComponent } from './vue-component';
import { CommandName } from './command';

export interface SidebarStore {
  opened: Ref<boolean>;
  component: ShallowRef<VueComponent | null>;
  close: () => void;
  open: () => void;
  openComponent: (cmp: VueComponent) => void;
  toggle: (cmp?: VueComponent) => void;
  commands: Ref<CommandName[]>;
  footerCommands: Ref<CommandName[]>;
  addCommand: (command: CommandName) => void;
  removeCommand: (command: CommandName) => void;
}

export type SidebarStoreDefinition = Store<SidebarStore>;
