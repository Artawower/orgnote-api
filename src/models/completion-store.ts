import { CompletionConfig } from './completion';
import { Store } from './store';

export interface CompletionStore {
  restore: () => void;
  close: () => void;
  closeAll: () => void;
  open: <T>(config: CompletionConfig<T>) => Promise<void>;
}

export type CompletionStoreDefinition = Store<CompletionStore>;
