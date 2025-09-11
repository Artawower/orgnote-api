// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Buffer<T = any> {
  path: string;
  title: string;

  content: string;

  isSaving: boolean;
  isLoading: boolean;

  lastAccessed: Date;
  referenceCount: number;

  metadata: Record<string, T>;
}
