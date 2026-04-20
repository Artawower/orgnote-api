import type { ComputedRef } from 'vue';
import type { StoreDefinition } from './store';
import type { ClientUpdateRecord } from './client-update';

export interface ClientUpdateStore {
  hasUnreadLatestChange: ComputedRef<boolean>;
  refreshUnreadState: () => Promise<void>;
  getLatestChange: () => Promise<ClientUpdateRecord | null>;
  markLatestChangeAsRead: () => void;
  getCachedLatestChange: () => ClientUpdateRecord | null;
}

export type ClientUpdateStoreDefinition = StoreDefinition<ClientUpdateStore>;
