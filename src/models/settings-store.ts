import type { Ref } from 'vue';
import { OrgNoteSettings } from './orgnote-config';
import { Store } from './store';
import { ModelsAPIToken } from 'src/remote-api';

export interface SettingsStore {
  settings: OrgNoteSettings;
  tokens: Ref<ModelsAPIToken[]>;
}

export type SettingsStoreDefinition = Store<SettingsStore>;
