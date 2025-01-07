import {
  Command,
  CSSVariable,
  ThemeVariable,
  InlineEmbeddedWidget,
  MultilineEmbeddedWidget,
  OrgLineClass,
  FileSystem,
  WidgetBuilder,
  CommandPreview,
  OrgNoteEncryption,
  Modal,
  SyncStoreDefinition,
  FilesStoreDefinition,
  FileOpenerStoreDefinition,
  FileManageStoreDefinition,
  CommandsStoreDefinition,
  CommandsGroupStoreDefinition,
  FileInfoRepository,
  NoteInfoRepository,
} from './models';
// import type { NavigationFailure } from 'vue-router';
import { WidgetType } from './models/widget-type';
// import type { Component } from 'vue';
import { NodeType } from 'org-mode-ast';
// import { EditorExtension } from './models/editor';
// import { AuthStoreDefinition } from './models/auth-store';
import { ExtensionStoreDefinition } from './models/extension-store';
import { FileSystemStoreDefinition } from './models/file-system-store';
import { EncryptionStoreDefinition } from './models/encryption-store';
import { PlatformSpecificFn } from './models/platform-specific';

type WithNodeType<T> = { nodeType: NodeType } & T;

export type WidgetMeta =
  | ({ type: WidgetType.Inline } & WithNodeType<InlineEmbeddedWidget>)
  | ({ type: WidgetType.Multiline } & WithNodeType<MultilineEmbeddedWidget>)
  | ({ type: WidgetType.LineClass } & WithNodeType<OrgLineClass>);

export interface OrgNoteApi {
  [key: string]: unknown;
  /* Native file system API without additional batteries */
  infrastructure: {
    fileInfoRepository: FileInfoRepository;
    noteInfoRepository: NoteInfoRepository;
  };
  core: {
    useCommands: CommandsStoreDefinition;
    useCommandsGroup: CommandsGroupStoreDefinition;
    useExtenions: ExtensionStoreDefinition;
    useFileSystem: FileSystemStoreDefinition;
    useEncryption: EncryptionStoreDefinition;
  };
  utils: {
    clientOnly: PlatformSpecificFn;
    mobileOnly: PlatformSpecificFn;
    androidOnly: PlatformSpecificFn;
    desktopOnly: PlatformSpecificFn;
    serverOnly: PlatformSpecificFn;
  };
}
