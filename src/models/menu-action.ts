import { CommandName } from './command';

type DefinedMenuGroup = 'file' | 'dir' | 'tab';

export type MenuGroup = DefinedMenuGroup | (string & {});

export interface MenuActionBase<T = unknown> {
    icon?: string;
    title?: string;
}

export interface ManualMenuAction<T = unknown> extends MenuActionBase<T> {
    handler: (data: T) => void;
}

export interface CommandMenuAction extends MenuActionBase {
    command: CommandName;
}

export type MenuAction = ManualMenuAction | CommandMenuAction;

export interface MenuGroupParams {
    items: MenuAction[];
}
