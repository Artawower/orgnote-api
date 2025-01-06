import type { Ref } from 'vue';
import { ExtensionMeta, StoredExtension } from './extension';
import { Store } from './store';

export interface ExtensionStore {
  ready: Ref<boolean>;
  extensions: Ref<ExtensionMeta[]>;

  sync: () => Promise<void>;
  init: () => Promise<void>;

  enableExtension: (extensionName: string) => Promise<void>;
  disableExtension: (extensionName: string) => Promise<void>;

  enableSafeMode: () => Promise<void>;
  disableSafeMode: () => Promise<void>;

  isExtensionExist: (extensionName: string) => boolean;
  addExtension: (ext: StoredExtension) => void;

  deleteExtension: (ext: ExtensionMeta) => Promise<void>;
}

export type ExtensionStoreDefinition = Store<ExtensionStore>;
