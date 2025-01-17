import type { Ref } from 'vue';
import { Store } from './store';
import { CommandName } from './command';

export interface SettingsUiStore {
  settingsMenu: Ref<Record<string, CommandName[]>>;
}

export type SettingsUiStoreDefinition = Store<SettingsUiStore>;
