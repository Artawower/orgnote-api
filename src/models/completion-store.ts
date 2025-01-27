import { ComputedRef } from 'vue';
import { Completion, CompletionConfig } from './completion';
import { Store } from './store';

export interface CompletionStore {
  restore: () => void;
  close: () => void;
  closeAll: () => void;
  open: <T>(config: CompletionConfig<T>) => Promise<void>;
  activeCompletion?: ComputedRef<Completion>;
  nextCandidate: () => void;
  previousCandidate: () => void;
  search: (limit?: number, offset?: number) => void;
}

export type CompletionStoreDefinition = Store<CompletionStore>;
