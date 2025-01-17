/*
 * This are default commands. It's not a complete list
 * Some of the commands are dynamically generated or
 * can be added by user extensions.
 */
export enum DefaultCommands {
  // Global commands
  REPORT_BUG = 'report bug',
  OPEN_DEBUG_INFO = 'open debug info',
  SHOW_LOGS = 'show logs',
  TOGGLE_SIDEBAR = 'toggle sidebar',
  TOGGLE_FILE_MANAGER = 'toggle file manager',
  CREATE_NOTE = 'create note',
  PROJECT_INFO = 'project info',

  // Completion commands
  SEARCH = 'search',
  TOGGLE_COMMANDS = 'toggle commands',
  RESTORE_COMPLETION = 'restore last completion',
  EXIT_COMMAND_EXECUTOR = 'exit command executor',
  NEXT_CANDIDATE = 'next candidate',
  PREV_CANDIDATE = 'previous candidate',
  EXECUTE_CANDIDATE = 'execute candidate',

  // Settings
  SETTINGS = 'settings',
  RESET_THEME = 'reset theme',
  TOGGLE_DARK_MODE = 'toggle dark mode',
  TOGGLE_DEBUG_MODE = 'toggle debug mode',
  SELECT_THEME = 'select theme',
  SYSTEM_SETTINGS = 'system settings',
  LANGUAGE_SETTINGS = 'language settings',
  INTERFACE_SETTINGS = 'interface settings',
  SYNCHRONISATION_SETTINGS = 'synchronisation settings',
  SUBSCRIPTION_SETTINGS = 'subscription settings',
  KEYBINDINGS_SETTINGS = 'keybindings settings',
  DEVELOPER_SETTINGS = 'developer settings',
  EXTENSIONS_SETTINGS = 'extensions',
  ENCRYPTION_SETTINGS = 'encryption settings',
  API_SETTINGS = 'api settings',
  SOURCE_CODE = 'show source code',
  READ_WIKI = 'read wiki',
  SPONSOR = 'sponsor',

  // Routing
  OPEN_MY_NOTES = 'my notes',
  OPEN_DASHBOARD = 'dashboard',
  OPEN_PUBLIC_NOTE_LIST = 'public note list',
  OPEN_NOTE_EDITOR = 'edit mode',
  OPEN_NOTE_VIEWER = 'view mode',
  OPEN_GRAPH = 'graph',

  // Native mobile specific
  SELECT_FILE_PATH = 'select file path',
  PICK_SYNC_DIR = 'pick sync dir',

  // File management
  SYNC_FILES = 'sync files',
  ENCRYPT_NOTE = 'encrypt note',
  DECRYPT_NOTE = 'decrypt note',
}
