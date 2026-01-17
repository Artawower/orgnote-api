import type { Component } from 'vue';
import type { StoreDefinition } from './store';

export type BufferViewerComponent = Component | (() => Promise<Component>);

export interface ViewerMeta {
  id: string;
  name: string;
  icon?: string;
  priority?: number;
}

export interface BufferViewerEntry {
  pattern: string;
  component: BufferViewerComponent;
  meta: ViewerMeta;
}

export interface BufferViewerStore {
  register: (entry: BufferViewerEntry) => void;

  unregister: (viewerId: string) => void;

  getViewers: (path: string) => BufferViewerEntry[];

  getViewer: (path: string) => BufferViewerEntry | undefined;

  open: (uri: string) => Promise<void>;
}

export type BufferViewerStoreDefinition = StoreDefinition<BufferViewerStore>;
