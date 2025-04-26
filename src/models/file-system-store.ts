import { OrgNoteEncryption } from './encryption';
import { Store } from './store';
import { DiskFile } from '../models/file-system';
import { Ref } from 'vue';

export interface FileSystemStore {
  readFile: <T extends 'utf8' | 'binary'>(
    path: string | string[],
    encoding?: T
  ) => Promise<T extends 'utf8' ? string : Uint8Array>;
  writeFile(
    path: string | string[],
    content: string | Uint8Array,
    encryptionConfig?: OrgNoteEncryption
  ): Promise<void>;
  syncFile<T extends string | Uint8Array>(
    path: string | string[],
    content: T,
    time: number,
    encryptionConfig?: OrgNoteEncryption
  ): Promise<T>;
  rename(path: string | string[], newPath: string | string[]): Promise<void>;
  deleteFile(path: string | string[]): Promise<void>;
  removeAllFiles: () => Promise<void>;
  mkdir(path: string | string[]): Promise<void>;
  rmdir(path: string | string[]): Promise<void>;
  fileInfo(path: string | string[]): Promise<DiskFile>;
  readDir(path?: string | string[]): Promise<DiskFile[]>;
  dropFileSystem: () => Promise<void>;
  prettyVault: Ref<string>;
}

export type FileSystemStoreDefinition = Store<FileSystemStore>;
