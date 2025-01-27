import { COMMAND_GROUPS } from 'src/constants';
import { DefaultCommands } from './default-commands';
import { OrgNoteApi } from 'src/api';

export type CommandGroup =
  | (typeof COMMAND_GROUPS)[number]
  | (string & Record<never, never>);

export type CommandName = DefaultCommands | (string & {});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CommandHandlerParams<T = any> {
  event?: KeyboardEvent;
  data?: T;
  meta: CommandMeta<T>;
  [key: string]: unknown;
}

export interface CommandPreview {
  description?: string;
  command?: CommandName;
  title?: string | (() => string);
  icon?: string | (() => string);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CommandMeta<T = any> extends Partial<CommandPreview> {
  /* Where is this command available, default value is global */
  group?: CommandGroup;
  allowOnInput?: boolean;
  interactive?: boolean; // TODO: add support for interactive commands
  /* When command is system command, it will not be shown for users */
  system?: boolean;
  disabled?: () => boolean;
  isActive?: () => boolean;
  context?: {
    [key: string]: T;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Command<T = any, R = unknown> extends CommandMeta<T> {
  /* arguments depend on the current scope */
  handler: (
    api: OrgNoteApi,
    params?: CommandHandlerParams<T>
  ) => R | Promise<R>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommandCallback = <T = any>(meta: Command, data: T) => void;
