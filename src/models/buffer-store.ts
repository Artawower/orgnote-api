import type { ComputedRef, Ref } from 'vue';
import { StoreDefinition } from './store';
import { Buffer } from './buffer';

export interface BufferStore {
  buffers: Ref<Map<string, Buffer>>;

  allBuffers: ComputedRef<Buffer[]>;

  getOrCreateBuffer: (path: string) => Promise<Buffer>;
  releaseBuffer: (path: string) => void;
  closeBuffer: (path: string, force?: boolean) => Promise<boolean>;
  getBufferByPath: (path: string) => Buffer | undefined;
  saveAllBuffers: () => Promise<void>;
  cleanup: () => void;
}

export type BufferStoreDefinition = StoreDefinition<BufferStore>;
