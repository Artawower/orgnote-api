import type { ComputedRef, Ref } from 'vue';
import type { StoreDefinition } from './store';
import type {
  SyncPlan,
  SyncMethod,
  SyncState,
  SyncStateData,
} from '../sync/types';

export type SyncStatus =
  | 'idle'
  | 'planning'
  | 'syncing'
  | 'pending-conflicts'
  | 'error';

export interface SyncStore {
  status: Ref<SyncStatus>;
  lastSyncTime: Ref<string | null>;
  currentPlan: Ref<SyncPlan | null>;
  stateData: Ref<SyncStateData | null>;

  state: SyncState;

  registeredMethods: Ref<SyncMethod[]>;
  currentMethod: ComputedRef<SyncMethod | null>;

  register: (method: SyncMethod) => void;
  unregister: (id: string) => void;

  createPlan: () => Promise<SyncPlan>;
  executePlan: (plan: SyncPlan) => Promise<void>;
  sync: () => Promise<void>;
  reset: () => Promise<void>;
}

export type SyncStoreDefinition = StoreDefinition<SyncStore>;
