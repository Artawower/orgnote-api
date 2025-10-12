import { Ref, ShallowRef } from 'vue';
import { Store } from './store';
import { InitialPaneParams, Tab, Pane, PanesSnapshot } from './pane';
import { ComputedRef } from 'vue';
import type { NavigationFailure, RouteLocationRaw } from 'vue-router';
import { DropDirection, LayoutNode } from './layout';

export interface PaneStore {
  layout: ShallowRef<LayoutNode>;
  initLayout: () => void;
  findPaneInLayout: (paneId: string, node?: LayoutNode) => LayoutNode | null;
  splitPaneInLayout: (
    paneId: string,
    direction: DropDirection,
    createInitialTab?: boolean
  ) => Promise<string | null>;
  removePaneFromLayout: (paneId: string) => void;
  moveTab: (tabId: string, sourcePaneId: string, targetPaneId: string) => void;

  panes: Ref<Record<string, ShallowRef<Pane>>>;
  activePane: ComputedRef<Pane>;
  initNewPane: (params?: InitialPaneParams) => Promise<Pane>;
  getPane: (id: string) => ShallowRef<Pane>;
  activePaneId?: Ref<string>;
  addTab: (params?: InitialPaneParams) => Promise<Tab>;
  selectTab: (paneId: string, tabId: string) => void;
  closeTab: (paneId: string, tabId: string) => void;
  activeTab: ComputedRef<Tab>;
  navigate: (
    params: RouteLocationRaw
  ) => Promise<void | NavigationFailure | undefined>;
  navigateTab: (
    paneId: string,
    tabId: string,
    params: RouteLocationRaw
  ) => Promise<void | NavigationFailure | undefined>;
  getPanesSnapshot: () => PanesSnapshot;
  restorePanesSnapshot: (snapshot: PanesSnapshot) => Promise<void>;
  savePanes(): Promise<void>;
  restorePanes(): Promise<void>;
}

export type PaneStoreDefinition = Store<PaneStore>;
