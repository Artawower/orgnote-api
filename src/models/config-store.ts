import type { Ref, UnwrapNestedRefs } from 'vue';
import { OrgNoteConfig } from './orgnote-config';
import { StoreDefinition } from './store';

export interface ConfigStore {
  config: UnwrapNestedRefs<OrgNoteConfig>;
  configErrors: Ref<string[]>;
  sync: () => Promise<void>;
}

export type ConfigStoreDefinition = StoreDefinition<ConfigStore>;
