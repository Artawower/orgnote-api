import { ShallowRef } from 'vue';
import { Store } from './store';
import { LayoutNode, DropDirection as SplitDirection } from './layout';
import { LayoutSnapshot } from './pane';
import type { Nullable } from '../types/nullable';

export interface LayoutStore {
  layout: ShallowRef<LayoutNode>;

  initLayout: (layout?: LayoutNode) => Promise<void>;

  splitPaneInLayout: (
    paneId: string,
    direction: SplitDirection,
    createInitialTab?: boolean
  ) => Promise<Nullable<string>>;

  removePaneFromLayout: (paneId: string) => void;

  updateNodeSizes: (nodeId: string, sizes: number[]) => void;
  normalizeSizes: (sizes: number[]) => number[];

  saveLayout: () => Promise<void>;
  restoreLayout: () => Promise<void>;
  getLayoutSnapshot: () => LayoutSnapshot;
  restoreLayoutSnapshot: (snapshot: LayoutSnapshot) => Promise<void>;
}

export type LayoutStoreDefinition = Store<LayoutStore>;
