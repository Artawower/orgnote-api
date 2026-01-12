import type { ExtractPropTypes } from 'vue';
import type { StoreDefinition } from './store';
import type { VueComponent } from './vue-component';
import type { Panel } from './panel';

export type ComponentConfig<T extends VueComponent> = {
  componentProps?: ExtractPropTypes<T>;
};

export interface SidebarStore extends Panel {
  toggle: (cmp?: VueComponent) => void;
}

export type SidebarStoreDefinition = StoreDefinition<SidebarStore>;
