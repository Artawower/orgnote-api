import type { Ref } from 'vue';
import {
  ExtensionMeta,
  ExtensionSource,
  ExtensionSourceInfo,
} from './extension';
import { StoreDefinition } from './store';

export interface ExtensionStore {
  ready: Ref<boolean>;
  extensions: Ref<ExtensionMeta[]>;

  sync: () => Promise<void>;

  enableExtension: (extensionName: string) => Promise<void>;
  disableExtension: (extensionName: string) => Promise<void>;

  enableSafeMode: () => Promise<void>;
  disableSafeMode: () => Promise<void>;

  isExtensionExist: (extensionName: string) => boolean;

  installExtension: (source: ExtensionSourceInfo) => Promise<void>;

  addExtension: (meta: ExtensionMeta, source: ExtensionSource) => Promise<void>;

  importExtension: (file: File) => Promise<void>;

  deleteExtension: (extensionName: string) => Promise<void>;
}

export type ExtensionStoreDefinition = StoreDefinition<ExtensionStore>;
