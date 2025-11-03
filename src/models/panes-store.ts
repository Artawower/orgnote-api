import { Ref, ShallowRef, ComputedRef } from 'vue';
import { Store } from './store';
import { InitialTabParams, Tab, Pane, PaneSnapshot } from './pane';
import type { RouteLocationRaw } from 'vue-router';

export interface PaneStore {
  // TODO: feat/stable-beta make as reactive object
  panes: Ref<Record<string, ShallowRef<Pane>>>;
  activePaneId: Ref<string | null>;
  activePane: ComputedRef<Pane>;
  activeTab: ComputedRef<Tab>;

  createPane: (params?: Partial<Pane>) => Promise<Pane>;
  getPane: (id: string) => ShallowRef<Pane>;
  closePane: (paneId: string) => void;
  setActivePane: (paneId: string) => void;

  isDraggingTab: Ref<boolean>;
  draggedTabData: Ref<{ tabId: string; paneId: string } | null>;
  initNewTab: (params?: InitialTabParams) => Promise<Tab>;
  addTab: (paneId: string, params?: InitialTabParams) => Promise<Tab | null>;
  closeTab: (paneId: string, tabId: string) => Promise<boolean>;
  selectTab: (paneId: string, tabId: string) => void;
  moveTab: (
    tabId: string,
    fromPaneId: string,
    toPaneId: string,
    index?: number
  ) => Promise<Tab | null>;
  navigate: (
    params: RouteLocationRaw,
    paneId?: string,
    tabId?: string
  ) => Promise<void>;

  startDraggingTab: (tabId: string, paneId: string) => void;
  stopDraggingTab: () => void;

  getPanesData: () => PaneSnapshot[];
  restorePanesData: (panes: PaneSnapshot[]) => Promise<void>;
}

export type PaneStoreDefinition = Store<PaneStore>;
