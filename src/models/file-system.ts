export interface DiskFile {
  name: string;
  path: string;
  type: 'directory' | 'file';
  size: number;
  atime?: number;
  ctime?: number;
  mtime: number;
  uri?: string;
}

export class ErrorDirectoryNotFound extends Error {
  constructor(path: string) {
    super(`Directory not found: ${path}`);
  }
}

export class ErrorFileNotFound extends Error {
  constructor(path: string) {
    super(`File not found: ${path}`);
  }
}

export type FileSystemPlatform =
  | 'android'
  | 'ios'
  | 'mobile'
  | 'desktop'
  | 'web'
  | 'all';

export interface FileSystemInfo {
  name: string;
  fs: FileSystem;
  type?: FileSystemPlatform;
}

export interface FileSystem {
  readFile: <
    T extends 'utf8' | 'binary' = 'utf8',
    R = T extends 'utf8' ? string : Uint8Array,
  >(
    path: string,
    encoding?: T
  ) => Promise<R>;
  writeFile: (
    path: string,
    content: string | Uint8Array,
    encoding?: BufferEncoding
  ) => Promise<void>;
  readDir: (path: string) => Promise<DiskFile[]>;
  fileInfo: (path: string) => Promise<DiskFile>;
  rename: (path: string, newPath: string) => Promise<void>;
  deleteFile: (path: string) => Promise<void>;
  rmdir: (path: string) => Promise<void>;
  mkdir: (path: string) => Promise<void>;
  isDirExist: (path: string) => Promise<boolean>;
  isFileExist: (path: string) => Promise<boolean>;
  utimeSync: (
    path: string,
    atime?: string | number | Date,
    mtime?: string | number | Date
  ) => Promise<void>;
  init?: <T = unknown>(params?: T) => Promise<void>;
}
