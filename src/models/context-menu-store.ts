import { ContextMenuAction, ContextMenuGroupParams } from './context-menu';
import { StoreDefinition } from './store';

export interface ContextMenuStore {
  registerGroup: (group: string) => void;
  updateContextGroup: (group: string, params: ContextMenuGroupParams) => void;
  addContextMenuAction: (group: string, action: ContextMenuAction) => void;
  removeContextMenuAction: (group: string, action: ContextMenuAction) => void;
  getContextMenuActions: (group: string) => ContextMenuAction[];
}

export type ContextMenuStoreDefinition = StoreDefinition<ContextMenuStore>;
