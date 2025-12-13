export { createSyncPlan } from './create-sync-plan';
export { createPlan } from './plan';
export { createMemorySyncState } from './memory-state';
export { scanLocalFiles, findDeletedLocally } from './scan';
export { fetchRemoteChanges } from './fetch';
export { recoverState } from './recovery';

export {
  processUpload,
  processDownload,
  processDeleteLocal,
  processDeleteRemote,
  handleConflict,
  generateConflictPath,
  hasConflict,
} from './operations';

export type {
  SyncState,
  SyncStateData,
  SyncedFile,
  SyncStatus,
  LocalFile,
  RemoteFile,
  UploadResult,
  SyncPlan,
  SyncTask,
  SyncExecutor,
  SyncContext,
  CreateSyncPlanParams,
} from './types';
