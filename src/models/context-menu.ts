import { CommandName } from './command';

type DefinedContextMenuGroup = 'file' | 'dir' | 'tab';

export type ContextMenuGroup = DefinedContextMenuGroup | (string & {});

export interface CommonContextMenu<T = unknown> {
  icon?: string;
  title?: string;
}

export interface ContextMenuManualAction<T = unknown>
  extends CommonContextMenu<T> {
  handler: (data: T) => void;
}

export interface ContextMenuActionCommand extends CommonContextMenu {
  command: CommandName;
}

export type ContextMenuAction =
  | ContextMenuManualAction
  | ContextMenuActionCommand;

export interface ContextMenuGroupParams {
  items: ContextMenuAction[];
}
