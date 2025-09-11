import type { ComputedRef, Ref } from 'vue';
import { Store } from './store';
import { Buffer } from './buffer';

export interface BufferStore {
  buffers: Ref<Map<string, Buffer>>;

  currentBuffer: ComputedRef<Buffer | null>;
  allBuffers: ComputedRef<Buffer[]>;
  recentBuffers: ComputedRef<Buffer[]>;

  getOrCreateBuffer: (path: string) => Promise<Buffer>;
  releaseBuffer: (path: string) => void;
  closeBuffer: (path: string, force?: boolean) => Promise<boolean>;
  getBufferByPath: (path: string) => Buffer | null;
  saveAllBuffers: () => Promise<void>;
  cleanup: () => void;
}

export type BufferStoreDefinition = Store<BufferStore>;
