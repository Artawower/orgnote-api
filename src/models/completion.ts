export interface CompletionCandidate<T = unknown> {
  icon?: string | (() => string);
  group?: string | ((data?: T) => string);
  title?: string | (() => string);
  description?: string | (() => string);
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
  type?: 'input' | 'choice';
  placeholder?: string;
  itemHeight?: string;
  searchText?: string;
  onClicked?: (candidate: CompletionCandidate<T>) => void;
}

export interface Completion<T = unknown> extends CompletionConfig<T> {
  level?: number;
  candidates?: CompletionCandidate<T>[];
  selectedCandidateIndex?: number;
  total?: number;
  searchQuery: string;
}
