type BufferError = string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface BufferMetadata<T = any> {
  [key: string]: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Buffer<T = any> {
  path: string;
  title: string;

  content: string;

  isSaving: boolean;
  isLoading: boolean;
  encryptionStatus?: boolean;
  errors: BufferError[];

  lastAccessed: Date;
  referenceCount: number;

  metadata: BufferMetadata<T>;
}
