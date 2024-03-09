export const DEFAULT_KEYBINDING_GROUP = 'default';

export type CommandGroup =
  | 'settings'
  | 'editor'
  | 'global'
  | 'note-detail'
  | 'completion'
  | string;

export interface CommandHandlerParams<T = any> {
  event?: KeyboardEvent;
  data?: T;
  [key: string]: unknown;
}

export interface CommandPreview {
  description?: string;
  command?: string;
  title?: string | (() => string);
  icon?: string | (() => string);
}

export interface CommandMeta<T = any> extends Partial<CommandPreview> {
  // TODO: add support for multiple key sequences
  keySequence?: string | string[];
  /* Where is this command available, default value is global */
  group?: CommandGroup;
  allowOnInput?: boolean;
  ignorePrompt?: boolean;
  /* When command is system command, it will not be shown for users */
  system?: boolean;
  available?: () => boolean;
  context?: {
    [key: string]: T;
  };
}

export interface Command<T = any> extends CommandMeta<T> {
  /* arguments depend on the current scope */
  handler: (params?: CommandHandlerParams) => unknown | Promise<unknown>;
}
