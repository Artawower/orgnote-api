export { createSyncPlan } from './create-sync-plan';
export { createPlan } from './plan';
export { createMemorySyncState } from './memory-state';
export { createSyncPathIgnore, scanLocalFiles, findDeletedLocally } from './scan';
export { isSyncConflictPath } from './conflict-path';
export { fetchRemoteChanges, InvalidSyncChangesResponseError } from './fetch';
export type { InvalidSyncChangesResponseDetails } from './fetch';
export { recoverState } from './recovery';
export { getOldestSyncedAt } from './utils/oldest-synced-at';
export { hashContent, hashBytes } from './utils/content-hash';

export {
  processUpload,
  processDownload,
  processDeleteLocal,
  processDeleteRemote,
  handleConflict,
  generateConflictPath,
  hasConflict,
} from './operations';

export { mergeFile, mergeText, mergeToml } from './merge';

export { SyncOperationType, MergeOutcome, isMergeableFile } from './types';

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
  MergeResult,
  MergeInputs,
  BaseContentEntry,
  BaseContentStore,
} from './types';
