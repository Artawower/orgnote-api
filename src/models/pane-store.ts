import { Ref } from 'vue';
import { Store } from './store';
import { InitialPaneParams, Pane } from './pane';
import { ComputedRef } from 'vue';

export interface PaneStore {
  panes: Ref<Record<string, Pane>>;
  activePane: ComputedRef<Pane>;
  initNewPane: (params?: InitialPaneParams) => Promise<Pane>;
  getPane: (id: string) => Pane;
  activePaneId?: Ref<string>;
}

export type PaneStoreDefinition = Store<PaneStore>;
