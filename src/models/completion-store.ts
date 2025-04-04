import { ComputedRef } from 'vue';
import { Completion, CompletionConfig } from './completion';
import { Store } from './store';

export interface CompletionStore {
  restore: () => void;
  close: <TData = unknown>(data?: TData) => void;
  closeAll: () => void;
  open: <TItem, TReturn = void>(
    config: CompletionConfig<TItem>
  ) => Promise<TReturn>;
  activeCompletion?: ComputedRef<Completion>;
  nextCandidate: () => void;
  previousCandidate: () => void;
  search: (limit?: number, offset?: number) => void;
}

export type CompletionStoreDefinition = Store<CompletionStore>;
