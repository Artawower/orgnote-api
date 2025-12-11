import type { FileSystem } from '../models/file-system';
import type { SyncApiFactory } from '../remote-api';

export type SyncApi = ReturnType<typeof SyncApiFactory>;

export type FileStatus = 'synced' | 'dirty' | 'uploading' | 'downloading' | 'error' | 'conflict';

export interface SyncedFile {
  mtime: number;
  size: number;
  id?: string;
  version?: number;
  status: FileStatus;
  error?: string;
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
  clear(): Promise<void>;
}

export interface LocalFile {
  path: string;
  mtime: number;
  size: number;
}

export interface RemoteFile {
  id: string;
  path: string;
  version: number;
  deleted: boolean;
  updatedAt: string;
}

export interface UploadedFile extends LocalFile {
  id: string;
  version: number;
}

export interface DownloadedFile {
  path: string;
  mtime: number;
  size: number;
  id: string;
  version: number;
}

export interface Conflict {
  path: string;
  local: LocalFile;
  remote: RemoteFile;
}

export interface SyncError {
  path: string;
  operation: 'upload' | 'download' | 'deleteLocal' | 'deleteRemote';
  message: string;
}

export interface SyncPlan {
  toUpload: LocalFile[];
  toDownload: RemoteFile[];
  toDeleteLocal: string[];
  toDeleteRemote: string[];
  conflicts: Conflict[];
  serverTime: string;
}

export interface ApplyPlanResult {
  uploaded: UploadedFile[];
  downloaded: DownloadedFile[];
  deletedLocal: string[];
  deletedRemote: string[];
  conflicts: Conflict[];
  errors: SyncError[];
}

export interface SyncExecutor {
  upload: (file: LocalFile) => Promise<UploadedFile>;
  download: (file: RemoteFile) => Promise<DownloadedFile>;
  deleteLocal: (path: string) => Promise<void>;
  deleteRemote: (path: string) => Promise<void>;
}

export interface CreateSyncPlanParams {
  fs: FileSystem;
  api: SyncApi;
  state: SyncState;
  rootPath: string;
  ignorePatterns?: string[];
}

export interface SyncMethod {
  id: string;
  name: string;
  createPlan: (params: CreateSyncPlanParams) => Promise<SyncPlan>;
  applyPlan: (plan: SyncPlan, executor: SyncExecutor) => Promise<ApplyPlanResult>;
}
