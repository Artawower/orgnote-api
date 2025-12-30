import type { ExtractPropTypes, Ref } from 'vue';
import type { StoreDefinition } from './store';
import type { VueComponent } from './vue-component';
import type { Panel } from './panel';
import type { CommandName } from './command';

export type ComponentConfig<T extends VueComponent> = {
  componentProps?: ExtractPropTypes<T>;
};

export interface SidebarStore extends Panel {
  toggle: (cmp?: VueComponent) => void;
  footerCommands: Ref<CommandName[]>;
}

export type SidebarStoreDefinition = StoreDefinition<SidebarStore>;
