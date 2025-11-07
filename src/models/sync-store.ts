import type { Ref } from 'vue';
import { StoreDefinition } from './store';

export interface SyncStore {
  markToSync: () => Promise<void>;
  sync: () => Promise<void>;
  forceResync: () => Promise<void>;
  lastSyncTime: Ref<string>;
  reset: () => void;
}

export type SyncStoreDefinition = StoreDefinition<SyncStore>;
