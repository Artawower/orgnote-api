import type { Ref } from 'vue';
import type { StoreDefinition } from './store';
import type { SyncPlan, SyncStateData } from '../sync/types';

export type SyncStoreStatus = 'idle' | 'planning' | 'syncing' | 'error';

export interface SyncStore {
  status: Ref<SyncStoreStatus>;
  lastSyncTime: Ref<string | null>;
  currentPlan: Ref<SyncPlan | null>;
  stateData: Ref<SyncStateData | null>;

  createPlan: () => Promise<SyncPlan | null>;
  executePlan: (plan: SyncPlan) => Promise<void>;
  sync: () => Promise<void>;
  reset: () => Promise<void>;
}

export type SyncStoreDefinition = StoreDefinition<SyncStore>;
