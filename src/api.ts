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
  CommandsStoreDefinition,
  CommandsGroupStoreDefinition,
  FileInfoRepository,
  NoteInfoRepository,
  ModalStoreDefinition,
  SettingsStoreDefinition,
  SettingsUiStoreDefinition,
  MultipleUploadParams,
  UploadParams,
  CompletionStoreDefinition,
  PaneStoreDefinition,
  FileManagerStoreDefinition,
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
import { UseSplashScreen } from './models/splash-screen';
import {
  GetCssVar,
  GetCssTheme,
  GetNumericCssVar,
  GetCssProperty,
  GetCssNumericProperty,
  ApplyCSSVariables,
  ResetCSSVariables,
} from './models/css-utils';
import { UseBackgroundSettings } from './models/ui-store';
import { SidebarStoreDefinition } from './models/sidebar-store';
import type { QVueGlobals } from 'quasar';
import { ToolbarStoreDefinition } from './models/toolbar-store';
import type { App } from 'vue';
import { UseConfirmationModal } from './models/confirmation-modal';
import { FileSystemManagerStoreDefinition } from './models/file-system-manager-store';

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
    useSettings: SettingsStoreDefinition;
    useQuasar: () => QVueGlobals;
    useCompletion: CompletionStoreDefinition;
    usePane: PaneStoreDefinition;
    useFileSystemManager: FileSystemManagerStoreDefinition;
    app: App;
  };
  utils: {
    // Platform specific
    clientOnly: PlatformSpecificFn;
    mobileOnly: PlatformSpecificFn;
    androidOnly: PlatformSpecificFn;
    desktopOnly: PlatformSpecificFn;
    serverOnly: PlatformSpecificFn;

    // Styles
    getCssVar: GetCssVar;
    getCssTheme: GetCssTheme;
    getNumericCssVar: GetNumericCssVar;
    getCssProperty: GetCssProperty;
    getCssNumericProperty: GetCssNumericProperty;
    applyCSSVariables: ApplyCSSVariables<string>;
    resetCSSVariables: ResetCSSVariables<string>;

    // Clipboard
    copyToClipboard: (text: string) => Promise<void>;

    // Files
    uploadFiles: (params: MultipleUploadParams) => Promise<FileList>;
    uploadFile: (params?: UploadParams) => Promise<File>;
  };
  ui: {
    useSplashScreen: UseSplashScreen;
    useBackgroundSettings: UseBackgroundSettings;
    useSidebar: SidebarStoreDefinition;
    useToolbar: ToolbarStoreDefinition;
    useModal: ModalStoreDefinition;
    useSettingsUi: SettingsUiStoreDefinition;
    useConfirmationModal: UseConfirmationModal;
    useFileManager: FileManagerStoreDefinition;
  };
}
