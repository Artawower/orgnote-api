import type { Ref } from 'vue';
import { OrgNoteSettings } from './orgnote-config';
import { StoreDefinition } from './store';
import { ModelsAPIToken } from 'src/remote-api';

export interface SettingsStore {
  settings: OrgNoteSettings;
  tokens: Ref<ModelsAPIToken[]>;
}

export type SettingsStoreDefinition = StoreDefinition<SettingsStore>;
