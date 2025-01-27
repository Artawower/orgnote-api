import { Ref } from 'vue';
import { Store } from './store';
import { InitialPaneParams, Page, Pane } from './pane';
import { ComputedRef } from 'vue';

export interface PaneStore {
  panes: Ref<Record<string, Pane>>;
  activePane: ComputedRef<Pane>;
  initNewPane: (params?: InitialPaneParams) => Promise<Pane>;
  getPane: (id: string) => Pane;
  activePaneId?: Ref<string>;
  addPage: (params?: InitialPaneParams) => Promise<Page>;
  selectPage: (paneId: string, pageId: string) => void;
  closePage: (paneId: string, pageId: string) => void;
}

export type PaneStoreDefinition = Store<PaneStore>;
