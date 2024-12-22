import { DefaultCommands } from './default-commands';
import { COMMAND_GROUPS } from '../constants/command-groups.contant';

export type CommandGroup =
  | (typeof COMMAND_GROUPS)[number]
  | (string & Record<never, never>);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CommandHandlerParams<T = any> {
  event?: KeyboardEvent;
  data?: T;
  meta: CommandMeta<T>;
  [key: string]: unknown;
}

export interface CommandPreview {
  description?: string;
  command?: DefaultCommands | string;
  title?: string | (() => string);
  icon?: string | (() => string);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CommandMeta<T = any> extends Partial<CommandPreview> {
  // TODO: add support for multiple key sequences
  keySequence?: string | string[];
  /* Where is this command available, default value is global */
  group?: CommandGroup;
  allowOnInput?: boolean;
  interactive?: boolean; // TODO: add support for interactive commands
  /* When command is system command, it will not be shown for users */
  system?: boolean;
  disabled?: () => boolean;
  context?: {
    [key: string]: T;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Command<T = any, R = unknown> extends CommandMeta<T> {
  /* arguments depend on the current scope */
  handler: (params?: CommandHandlerParams<T>) => R | Promise<R>;
}
