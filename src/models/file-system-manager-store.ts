import { Ref } from 'vue';
import { FileSystemInfo, FileSystem } from './file-system';
import { StoreDefinition } from './store';
import { ComputedRef } from 'vue';

export interface FileSystemManagerStore {
  register(fs: FileSystemInfo): void;
  currentFsInfo: ComputedRef<FileSystemInfo | undefined>;
  currentFs: ComputedRef<FileSystem | undefined>;
  fileSystems: ComputedRef<FileSystemInfo[]>;
  currentFsName: Ref<string>;
  fsMounted: Ref<boolean>;
  isReconciling: Ref<boolean>;
  useFs: (fsName: string) => Promise<void>;
}

export type FileSystemManagerStoreDefinition =
  StoreDefinition<FileSystemManagerStore>;
