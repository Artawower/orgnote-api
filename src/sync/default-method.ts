import type { SyncMethod } from './types';
import { createSyncPlan } from './create-sync-plan';
import { applyPlan } from './apply';

export const DEFAULT_SYNC_METHOD_ID = 'orgnote-default';

export const defaultSyncMethod: SyncMethod = {
  id: DEFAULT_SYNC_METHOD_ID,
  name: 'OrgNote Sync',
  createPlan: createSyncPlan,
  applyPlan,
};
