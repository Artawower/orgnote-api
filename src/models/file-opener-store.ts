import { Store } from './store';

export interface FileOpenerStore {
  openFile: (path: string[]) => Promise<void>;
}

export type FileOpenerStoreDefinition = Store<FileOpenerStore>;
