import { Store } from './store';
import { Ref, ShallowRef } from 'vue';
import { DiskFile } from './file-system';

export interface FileManagerStore {
  path: Ref<string>;
  focusFile: ShallowRef<DiskFile>;
  focusDirPath: Ref<string>;
  deleteFile: (path?: string) => Promise<void>;
  createFolder: (path?: string) => Promise<void>;
  createFile: (path?: string) => Promise<void>;
}

export type FileManagerStoreDefinition = Store<FileManagerStore>;
