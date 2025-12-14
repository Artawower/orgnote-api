import type { FileSystem } from '../models/file-system';
import type { FileChange, SyncApiFactory } from '../remote-api';

export type SyncApi = ReturnType<typeof SyncApiFactory>;

export type SyncStatus = 'synced' | 'dirty' | 'uploading' | 'downloading' | 'error';

export interface SyncedFile {
  mtime: number;
  size: number;
  version?: number;
  status: SyncStatus;
  conflictPath?: string;
  errorMessage?: string;
}

export interface SyncStateData {
  files: Record<string, SyncedFile>;
  lastSyncTime?: string;
}

export interface SyncState {
  get(): Promise<SyncStateData>;
  getFile(path: string): Promise<SyncedFile | null>;
  setFile(path: string, file: SyncedFile): Promise<void>;
  removeFile(path: string): Promise<void>;
  setLastSyncTime(time: string): Promise<void>;
  clear(): Promise<void>;
}

export interface LocalFile {
  path: string;
  mtime: number;
  size: number;
}

export type RemoteFile = Pick<FileChange, 'path' | 'version' | 'deleted' | 'updatedAt'>;

export type UploadResult =
  | { status: 'ok'; version: number }
  | { status: 'conflict'; serverVersion: number };

export interface SyncExecutor {
  upload: (file: LocalFile, expectedVersion?: number) => Promise<UploadResult>;
  download: (file: RemoteFile) => Promise<void>;
  deleteLocal: (path: string) => Promise<void>;
  deleteRemote: (path: string, expectedVersion: number) => Promise<void>;
}

export interface SyncPlan {
  toUpload: LocalFile[];
  toDownload: RemoteFile[];
  toDeleteLocal: string[];
  toDeleteRemote: string[];
  serverTime: string;
}

export interface SyncTask {
  path: string;
  operation: 'upload' | 'download' | 'deleteLocal' | 'deleteRemote';
  file?: LocalFile | RemoteFile;
}

export interface CreateSyncPlanParams {
  fs: FileSystem;
  api: SyncApi;
  state: SyncState;
  rootPath: string;
  ignorePatterns?: string[];
}

export interface SyncContext {
  executor: SyncExecutor;
  state: SyncState;
  fs: FileSystem;
  deviceName?: string;
}
