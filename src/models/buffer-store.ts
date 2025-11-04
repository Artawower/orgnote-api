import type { ComputedRef, Ref } from 'vue';
import { Store } from './store';
import { Buffer } from './buffer';
import { Nullable } from '../types/nullable';

export interface BufferStore {
  buffers: Ref<Map<string, Buffer>>;

  allBuffers: ComputedRef<Buffer[]>;

  getOrCreateBuffer: (path: string) => Promise<Buffer>;
  releaseBuffer: (path: string) => void;
  closeBuffer: (path: string, force?: boolean) => Promise<boolean>;
  getBufferByPath: (path: string) => Nullable<Buffer>;
  saveAllBuffers: () => Promise<void>;
  cleanup: () => void;
}

export type BufferStoreDefinition = Store<BufferStore>;
