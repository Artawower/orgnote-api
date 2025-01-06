import type { Ref, UnwrapNestedRefs } from 'vue';
import { OrgNoteConfig } from './orgnote-config';
import { Store } from './store';

export interface SettingsStore {
  config: UnwrapNestedRefs<OrgNoteConfig>;
  configErrors: Ref<string[]>;
  sync: () => Promise<void>;
}

export type SettingsStoreDefinition = Store<SettingsStore>;
