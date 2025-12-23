import type { Component } from 'vue';
import type { StoreDefinition } from './store';

export type FileReaderComponent = Component | (() => Promise<Component>);

export interface ReaderMeta {
  id: string;
  name: string;
  icon?: string;
  priority?: number;
}

export interface FileReaderEntry {
  pattern: string;
  component: FileReaderComponent;
  meta: ReaderMeta;
}

export interface FileReaderStore {
  register: (entry: FileReaderEntry) => void;

  unregister: (readerId: string) => void;

  getReaders: (path: string) => FileReaderEntry[];

  getReader: (path: string) => FileReaderEntry | undefined;

  openFile: (path: string) => Promise<void>;
}

export type FileReaderStoreDefinition = StoreDefinition<FileReaderStore>;
