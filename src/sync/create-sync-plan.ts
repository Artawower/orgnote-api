import type { CreateSyncPlanParams, SyncPlan } from './types';
import { scanLocalFiles, findDeletedLocally } from './scan';
import { fetchRemoteChanges } from './fetch';
import { createPlan } from './plan';
import { getOldestSyncedAt } from './utils/oldest-synced-at';

export async function createSyncPlan(params: CreateSyncPlanParams): Promise<SyncPlan> {
  const { fs, api, state, rootPath, ignorePatterns } = params;

  const stateData = await state.get();

  const localFiles = await scanLocalFiles(fs, rootPath, ignorePatterns);
  const deletedLocally = findDeletedLocally(localFiles, stateData);

  const since = getOldestSyncedAt(stateData);

  const { files: remoteFiles, serverTime } = await fetchRemoteChanges(api, since);

  return createPlan({ localFiles, deletedLocally, remoteFiles, stateData, serverTime });
}
