import {
  InlineEmbeddedWidget,
  MultilineEmbeddedWidget,
  OrgLineClass,
  SyncStoreDefinition,
  BufferViewerStoreDefinition,
  CommandsStoreDefinition,
  CommandsGroupStoreDefinition,
  ModalStoreDefinition,
  SettingsStoreDefinition,
  SettingsUiStoreDefinition,
  MultipleUploadParams,
  UploadParams,
  CompletionStoreDefinition,
  PaneStoreDefinition,
  LayoutStoreDefinition,
  FileManagerStoreDefinition,
  UseScreenDetection,
  UseKeyboardState,
  NotificationsStoreDefinition,
  BufferStoreDefinition,
  BufferProviderStoreDefinition,
  Repositories,
  LogStoreDefinition,
  UseSystemInfo,
  ContextMenuStoreDefinition,
  QueueStoreDefinition,
  FileGuardStoreDefinition,
  FileWatcherStoreDefinition,
  BuildOrgNoteUrl,
  AuthStoreDefinition,
  FileSearchStoreDefinition,
  FileMetaStoreDefinition,
  FontStoreDefinition,
  EmbeddedBufferStoreDefinition,
  UseFileContent,
} from './models';
import { WebSocketClient } from './websocket/client';
import { WidgetType } from './models/widget-type';
import { NodeType } from 'org-mode-ast';
import { ExtensionStoreDefinition } from './models/extension-store';
import { EditorStoreDefinition } from './models/editor-store';
import { BabelStoreDefinition } from './models/babel-store';
import { FileSystemStoreDefinition } from './models/file-system-store';
import { EncryptionStoreDefinition } from './models/encryption-store';
import { PlatformSpecificFn } from './models/platform-specific';
import { PlatformDetection, PlatformMatch } from './models/platform-detection';
import { UseSplashScreen } from './models/splash-screen';
import {
  GetCssVar,
  GetCssTheme,
  GetNumericCssVar,
  GetCssProperty,
  GetCssNumericProperty,
  ApplyCSSVariables,
  ResetCSSVariables,
  ApplyScopedStyles,
  RemoveScopedStyles,
} from './models/css-utils';
import { ThemeStoreDefinition } from './models/theme-store';
import { UseBackgroundSettings } from './models/ui-store';
import { SidebarStoreDefinition } from './models/sidebar-store';
import { RightSidebarStoreDefinition } from './models/right-sidebar-store';
import { Logger } from './models/logger';
import type { QVueGlobals } from 'quasar';
import { PinnedCommandsStoreDefinition } from './models/pinned-commands-store';
import type { App } from 'vue';
import { UseConfirmationModal } from './models/confirmation-modal';
import { FileSystemManagerStoreDefinition } from './models/file-system-manager-store';
import { ConfigStoreDefinition } from './models/config-store';
import { Router } from 'vue-router';
import { CronStoreDefinition } from './models/cron-store';
import { GitStoreDefinition } from './models/git-store';
import { ExtensionRegistryStoreDefinition } from './models/extension-registry-store';
import { parseToml, stringifyToml } from './utils';

type WithNodeType<T> = { nodeType: NodeType } & T;

export type WidgetMeta =
  | ({ type: WidgetType.Inline } & WithNodeType<InlineEmbeddedWidget>)
  | ({ type: WidgetType.Multiline } & WithNodeType<MultilineEmbeddedWidget>)
  | ({ type: WidgetType.LineClass } & WithNodeType<OrgLineClass>);

export type Infrastructure = Repositories & { websocket: WebSocketClient };

export interface OrgNoteApi {
  [key: string]: unknown;
  /* Native file system API without additional batteries */
  infrastructure: Infrastructure;
  core: {
    useCommands: CommandsStoreDefinition;
    useCommandsGroup: CommandsGroupStoreDefinition;
    useExtensions: ExtensionStoreDefinition;
    useFileSystem: FileSystemStoreDefinition;
    useFileWatcher: FileWatcherStoreDefinition;
    useEncryption: EncryptionStoreDefinition;
    useSettings: SettingsStoreDefinition;
    useConfig: ConfigStoreDefinition;
    useQuasar: () => QVueGlobals;
    useCompletion: CompletionStoreDefinition;
    usePane: PaneStoreDefinition;
    useLayout: LayoutStoreDefinition;
    useFileSystemManager: FileSystemManagerStoreDefinition;
    useFileManager: FileManagerStoreDefinition;
    useBufferViewer: BufferViewerStoreDefinition;
    useNotifications: NotificationsStoreDefinition;
    useBuffers: BufferStoreDefinition;
    useBufferProviders: BufferProviderStoreDefinition;
    useSystemInfo: UseSystemInfo;
    useLog: LogStoreDefinition;
    useQueue: QueueStoreDefinition;
    useCron: CronStoreDefinition;
    useGit: GitStoreDefinition;
    useExtensionRegistry: ExtensionRegistryStoreDefinition;
    useFileGuard: FileGuardStoreDefinition;
    useAuth: AuthStoreDefinition;
    useSync: SyncStoreDefinition;
    useEditor: EditorStoreDefinition;
    useBabel: BabelStoreDefinition;
    useFileSearch: FileSearchStoreDefinition;
    useFileMeta: FileMetaStoreDefinition;
    useEmbeddedBuffer: EmbeddedBufferStoreDefinition;
    useFileContent: UseFileContent;
    app: App;
  };
  utils: {
    // Platform specific
    platform: PlatformDetection;
    platformMatch: PlatformMatch;
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
    applyScopedStyles: ApplyScopedStyles;
    removeScopedStyles: RemoveScopedStyles;

    // Clipboard
    copyToClipboard: (text: string) => Promise<void>;

    // Files
    uploadFiles: (params: MultipleUploadParams) => Promise<FileList>;
    uploadFile: (params?: UploadParams) => Promise<File | undefined>;

    // Logger
    logger: Logger;

    // Parsers
    parseToml: typeof parseToml;
    stringifyToml: typeof stringifyToml;

    // URL
    buildOrgNoteUrl: BuildOrgNoteUrl;
  };
  ui: {
    useFonts: FontStoreDefinition;
    useSplashScreen: UseSplashScreen;
    useBackgroundSettings: UseBackgroundSettings;
    useSidebar: SidebarStoreDefinition;
    useRightSidebar: RightSidebarStoreDefinition;
    usePinnedCommands: PinnedCommandsStoreDefinition;
    useModal: ModalStoreDefinition;
    useSettingsUi: SettingsUiStoreDefinition;
    useConfirmationModal: UseConfirmationModal;
    useScreenDetection: UseScreenDetection;
    useKeyboardState: UseKeyboardState;
    useContextMenu: ContextMenuStoreDefinition;
    useTheme: ThemeStoreDefinition;
  };
  vue: {
    router: Router;
  };
}
