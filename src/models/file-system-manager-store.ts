import { Ref } from 'vue';
import { FileSystemInfo, FileSystem } from './file-system';
import { Store } from './store';
import { ComputedRef } from 'vue';

export interface FileSystemManagerStore {
  register(fs: FileSystemInfo): void;
  currentFsInfo: ComputedRef<FileSystemInfo>;
  currentFs: ComputedRef<FileSystem>;
  fileSystems: ComputedRef<FileSystemInfo[]>;
  currentFsName: Ref<string>;
  useFs: (fsName: string) => Promise<void>;
}

export type FileSystemManagerStoreDefinition = Store<FileSystemManagerStore>;
