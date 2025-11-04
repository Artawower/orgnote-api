import { Ref, ShallowRef, ComputedRef } from 'vue';
import { Store } from './store';
import { InitialTabParams, Tab, Pane, PaneSnapshot } from './pane';
import type { RouteLocationRaw } from 'vue-router';
import type { Nullable } from '../types/nullable';

export interface PaneStore {
  panes: Ref<Record<string, ShallowRef<Pane>>>;
  activePaneId: Ref<Nullable<string>>;
  activePane: ComputedRef<Pane>;
  activeTab: ComputedRef<Tab>;

  createPane: (params?: Partial<Pane>) => Promise<Pane>;
  getPane: (id: string) => ShallowRef<Nullable<Pane>>;
  closePane: (paneId: string) => void;
  setActivePane: (paneId: string) => void;

  isDraggingTab: Ref<boolean>;
  draggedTabData: Ref<Nullable<{ tabId: string; paneId: string }>>;
  initNewTab: (params?: InitialTabParams) => Promise<Tab>;
  addTab: (paneId: string, params?: InitialTabParams) => Promise<Nullable<Tab>>;
  closeTab: (paneId: string, tabId: string) => Promise<boolean>;
  selectTab: (paneId: string, tabId: string) => void;
  moveTab: (
    tabId: string,
    fromPaneId: string,
    toPaneId: string,
    index?: number
  ) => Promise<Nullable<Tab>>;
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
