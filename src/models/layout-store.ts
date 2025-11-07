import { ShallowRef } from 'vue';
import { StoreDefinition } from './store';
import { LayoutNode, DropDirection as SplitDirection } from './layout';
import { LayoutSnapshot } from './pane';

export interface LayoutStore {
  layout: ShallowRef<LayoutNode | undefined>;

  initLayout: (layout?: LayoutNode) => Promise<void>;

  splitPaneInLayout: (
    paneId: string,
    direction: SplitDirection,
    createInitialTab?: boolean
  ) => Promise<string | undefined>;

  removePaneFromLayout: (paneId: string) => void;

  updateNodeSizes: (nodeId: string, sizes: number[]) => void;
  normalizeSizes: (sizes: number[]) => number[];

  saveLayout: () => Promise<void>;
  restoreLayout: () => Promise<void>;
  getLayoutSnapshot: () => LayoutSnapshot | undefined;
  restoreLayoutSnapshot: (snapshot: LayoutSnapshot) => Promise<void>;
}

export type LayoutStoreDefinition = StoreDefinition<LayoutStore>;
