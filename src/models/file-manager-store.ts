import { StoreDefinition } from './store';
import { Ref, ShallowRef } from 'vue';
import { DiskFile } from './file-system';

export interface FileManagerStore {
  path: Ref<string>;
  focusFile: ShallowRef<DiskFile | undefined>;
  focusDirPath: Ref<string>;
  deleteFile: (path?: string) => Promise<void>;
  createFolder: (path?: string) => Promise<void>;
  createFile: (path?: string) => Promise<void>;
}

export type FileManagerStoreDefinition = StoreDefinition<FileManagerStore>;
