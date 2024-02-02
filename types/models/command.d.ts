export declare const DEFAULT_KEYBINDING_GROUP = "default";
export type CommandGroup = 'settings' | 'editor' | 'global' | 'note-detail' | 'completion' | string;
export interface CommandHandlerParams {
    event?: KeyboardEvent;
    data?: unknown;
    [key: string]: unknown;
}
export interface Command {
    keySequence?: string | string[];
    description?: string;
    command?: string;
    title?: string | (() => string);
    icon?: string | (() => string);
    group?: CommandGroup;
    allowOnInput?: boolean;
    ignorePrompt?: boolean;
    handler: (params?: CommandHandlerParams) => unknown | Promise<unknown>;
}
