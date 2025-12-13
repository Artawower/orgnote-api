import type { SyncedFile, SyncStatus } from '../types';

interface FileMeta {
  mtime: number;
  size: number;
}

export interface SyncedFileOptions {
  version?: number;
  status: SyncStatus;
  errorMessage?: string;
  conflictPath?: string;
}

export const createSyncedFile = (meta: FileMeta, options: SyncedFileOptions): SyncedFile => ({
  mtime: meta.mtime,
  size: meta.size,
  ...options,
});
