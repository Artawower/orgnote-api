import { Store } from './store';

export interface FileReaderStore {
  addReader: (
    readerMatch: string,
    reader: (path: string) => Promise<void>
  ) => void;
  openFile: (path: string) => Promise<void>;
}

export type FileReaderStoreDefinition = Store<FileReaderStore>;
