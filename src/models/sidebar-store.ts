import type { ExtractPropTypes, Ref } from 'vue';
import { StoreDefinition } from './store';
import type { ShallowRef } from 'vue';
import type { VueComponent } from './vue-component';
import { CommandName } from './command';

export type ComponentConfig<T extends VueComponent> = {
  componentProps?: ExtractPropTypes<T>;
};

export interface SidebarStore {
  opened: Ref<boolean>;
  component: ShallowRef<VueComponent | undefined>;
  componentConfig: ShallowRef<ComponentConfig<VueComponent> | undefined>;
  close: () => void;
  open: () => void;
  openComponent: <T extends VueComponent>(
    cmp: T,
    config?: ComponentConfig<T>
  ) => void;
  toggle: (cmp?: VueComponent) => void;
  commands: Ref<CommandName[]>;
  footerCommands: Ref<CommandName[]>;
  addCommand: (command: CommandName) => void;
  removeCommand: (command: CommandName) => void;
}

export type SidebarStoreDefinition = StoreDefinition<SidebarStore>;
