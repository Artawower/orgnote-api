import {
  Command,
  CSSVariable,
  ThemeVariable,
  Note,
  InlineEmbeddedWidget,
  MultilineEmbeddedWidget,
  OrgLineClass,
  WidgetBuilder,
  CommandPreview,
  OrgNoteEncryption,
  Modal,
} from './models';
import type { NavigationFailure } from 'vue-router';
import { WidgetType } from './models/widget-type';
import type { Component } from 'vue';
import { NodeType } from 'org-mode-ast';
import { EditorExtension } from './models/editor';

type WithNodeType<T> = { nodeType: NodeType } & T;

export type WidgetMeta =
  | ({ type: WidgetType.Inline } & WithNodeType<InlineEmbeddedWidget>)
  | ({ type: WidgetType.Multiline } & WithNodeType<MultilineEmbeddedWidget>)
  | ({ type: WidgetType.LineClass } & WithNodeType<OrgLineClass>);

export interface OrgNoteApi {
  [key: string]: unknown;
  getExtension?<T>(config: string): T;

  system: {
    reload: (params?: { verbose: boolean }) => Promise<void>;
    setNewFilesAvailable: (status?: boolean) => void;
  };
  navigation: {
    openNote: (id: string) => Promise<void | NavigationFailure>;
    editNote: (id: string) => Promise<void | NavigationFailure>;
  };
  ui: {
    applyTheme: (theme: { [key in ThemeVariable]: string | number }) => void;
    applyCssVariables: (styles: {
      [key in CSSVariable]: string | number;
    }) => void;
    setThemeByMode: (themeName?: string) => void;
    setDarkTheme: (themeName?: string) => void;
    setLightTheme: (themeName?: string) => void;
    applyStyles: (scopeName: string, styles: string) => void;
    removeStyles: (scopeName: string) => void;
    resetTheme: () => void;
    openModal: (modal: Modal) => void;
  };
  interaction: {
    confirm: (title: string, message: string) => Promise<boolean>;
  };
  currentNote: {
    get: () => Note;
  };
  editor: {
    extensions: {
      add: (...extension: EditorExtension[]) => void;
      remove: (...extension: EditorExtension[]) => void;
    };
    widgets: {
      add: (...widgetMeta: WidgetMeta[]) => void;
      createWidgetBuilder: (
        cmp: Component,
        props?: { [key: string]: unknown }
      ) => WidgetBuilder;
    };
  };
  // Available only on mobile apps
  fileSystem: {
    readPath: () => Promise<string>;
  };
  commands: {
    add(...commands: Command[]): void;
    remove(...commands: Command[]): void;
    get(name: string): Command;
    getAll(): Command[];
    addCommandToSidebar(...commands: CommandPreview[]): void;
    removeCommandFromSidebar(...commands: CommandPreview[]): void;
    addCommandToEditorPanel(...commands: CommandPreview[]): void;
    removeCommandFromEditorPanel(...commands: CommandPreview[]): void;
  };
  configuration: () => OrgNoteConfig;
}

// TODO: master move model to the backend service
export interface OrgNoteConfig {
  editor: {
    showSpecialSymbols: boolean;
    showPropertyDrawer: boolean;
  };
  developer: {
    developerMode: boolean;
    maximumLogsCount: number;
  };
  completion: {
    showGroup: boolean;
    defaultCompletionLimit: number;
  };
  system: {
    language: string;
  };
  synchronization: {
    type: 'none' | 'api' | 'filesystem';
    path?: string;
  };
  ui: {
    showUserProfiles: boolean;
    theme: 'light' | 'dark' | 'auto';
    darkThemeName?: string;
    lightThemeName?: string;
  };
  extensions: {
    sources: string[];
  };
  encryption: OrgNoteEncryption;
}
