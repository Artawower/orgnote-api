import { StoreDefinition } from './store';
import { ComputedRef, Ref, ShallowRef } from 'vue';
import { DiskFile } from './file-system';

export type PendingFileOperation = {
  type: 'copy' | 'move';
  paths: string[];
};

export interface FileManagerStore {
  path: Ref<string>;
  focusFile: ShallowRef<DiskFile | undefined>;
  focusDirPath: Ref<string>;
  searchQuery: Ref<string>;
  mobileFileSearchActive: Ref<boolean>;

  selectionMode: ComputedRef<boolean>;
  selectedFiles: Ref<Set<string>>;
  operationTargets: ComputedRef<string[]>;
  pendingOperation: Ref<PendingFileOperation | undefined>;
  toggleSelection: (path: string) => void;
  selectFiles: (files: DiskFile[]) => void;
  clearSelection: () => void;

  startCopy: (paths: string[]) => void;
  startMove: (paths: string[]) => void;
  executePending: (dest: string) => Promise<void>;
  cancelPending: () => void;

  copyFiles: (paths: string[], dest: string) => Promise<void>;
  moveFiles: (paths: string[], dest: string) => Promise<void>;
  deleteFiles: (paths: string[]) => Promise<void>;
  createFolder: (path?: string) => Promise<void>;
  createFile: (path?: string) => Promise<void>;
}

export type FileManagerStoreDefinition = StoreDefinition<FileManagerStore>;
