import { StoreDefinition } from './store';

export interface FileReaderStore {
  addReader: (
    readerMatch: string,
    reader: (path: string) => Promise<void>
  ) => void;
  addReaders: (
    readers: Record<string, (path: string) => Promise<void>>
  ) => void;
  openFile: (path: string) => Promise<void>;
}

export type FileReaderStoreDefinition = StoreDefinition<FileReaderStore>;
