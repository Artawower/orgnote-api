import { MenuAction, MenuGroupParams } from './menu-action';
import { StoreDefinition } from './store';

export interface ContextMenuStore {
  registerGroup: (group: string) => void;
  updateContextGroup: (group: string, params: MenuGroupParams) => void;
  addContextMenuAction: (group: string, action: MenuAction) => void;
  removeContextMenuAction: (group: string, action: MenuAction) => void;
  getContextMenuActions: (group: string) => MenuAction[];
}

export type ContextMenuStoreDefinition = StoreDefinition<ContextMenuStore>;
