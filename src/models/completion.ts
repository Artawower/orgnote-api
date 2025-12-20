import { MaybeRefOrGetter } from 'vue';
import type { CommandIcon } from './command';

export interface CompletionCandidate<T = unknown> {
  icon?: MaybeRefOrGetter<CommandIcon | undefined>;
  group?: MaybeRefOrGetter<string | undefined>;
  title?: MaybeRefOrGetter<string | undefined>;
  description?: MaybeRefOrGetter<string | undefined>;
  data: T;
  commandHandler: (data: T) => void;
}

export interface CompletionSearchResult<T = unknown> {
  total?: number;
  result: CompletionCandidate<T>[];
}

export type CandidateGetterFn<T = unknown> = (
  filter: string,
  limit?: number,
  offset?: number
) => CompletionSearchResult<T> | Promise<CompletionSearchResult<T>>;

export interface CompletionConfig<T = unknown> {
  searchAutocompletions?: string[];
  itemsGetter: CandidateGetterFn<T>;
  type?: 'input' | 'choice' | 'input-choice';
  placeholder?: string;
  itemHeight?: string;
  searchText?: string;
  onClicked?: (candidate: CompletionCandidate<T>) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Completion<T = any, TResult = any>
  extends CompletionConfig<T> {
  level?: number;
  candidates?: CompletionCandidate<T>[];
  selectedCandidateIndex?: number;
  total?: number;
  searchQuery: string;
  result: Promise<TResult>;
}
