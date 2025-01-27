import { Ref } from 'vue';
import { FileSystemInfo, FileSystem } from './file-system';
import { Store } from './store';
import { ComputedRef } from 'vue';

export interface FileSystemManagerStore {
  register(fs: FileSystemInfo): void;
  currentFs: ComputedRef<FileSystem>;
  fileSystems: ComputedRef<FileSystemInfo[]>;
  currentFsName: Ref<string>;
}

export type FileSystemManagerStoreDefinition = Store<FileSystemManagerStore>;
