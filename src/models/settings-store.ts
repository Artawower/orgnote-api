import type { Ref, UnwrapNestedRefs } from 'vue';
import { OrgNoteConfig } from './orgnote-config';
import { Store } from './store';
import { ModelsAPIToken } from 'src/remote-api';

export interface SettingsStore {
  config: UnwrapNestedRefs<OrgNoteConfig>;
  configErrors: Ref<string[]>;
  sync: () => Promise<void>;
  tokens: Ref<ModelsAPIToken[]>;
}

export type SettingsStoreDefinition = Store<SettingsStore>;
