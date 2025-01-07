import { OrgNoteEncryption } from './encryption';
import { Store } from './store';
import { DiskFile, FileSystem } from '../models/file-system';
import { Ref } from 'vue';
import { OrgNoteApi } from 'src/api';

export interface FileSystemStore {
  readFile: (
    path: string | string[],
    encoding?: 'utf8' | 'binary'
  ) => Promise<Uint8Array>;
  readTextFile(
    path: string | string[],
    encryptionConfig?: OrgNoteEncryption
  ): Promise<string>;
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

  pickFileSystem(fsName: string): Promise<void>;
  registerFileSystem(
    name: string,
    fs: FileSystem | ((api: OrgNoteApi) => Promise<FileSystem>)
  ): Promise<void>;
  unregisterFileSystem(name: string): Promise<void>;
  hasAccess: Ref<boolean>;
  getPermissions: () => Promise<void>;

  activeFileSystemName: Ref<string>;
  fileSystems: Ref<{ [name: string]: FileSystem }>;
}

export type FileSystemStoreDefinition = Store<FileSystemStore>;
