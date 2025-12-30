import type { Ref } from 'vue';
import type { StoreDefinition } from './store';
import type { Panel } from './panel';

export interface RightPanelStore extends Panel {
  width: Ref<number>;
  setWidth: (width: number) => void;
}

export type RightPanelStoreDefinition = StoreDefinition<RightPanelStore>;
