import type { ValidationState } from './file-guard';

type BufferError = string;

export interface BufferMetadata<T = unknown> {
  [key: string]: T;
}

export interface BufferGuard {
  readonly: boolean;
  reason?: string;
  validation?: ValidationState;
}

export interface Buffer<T = unknown> {
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

  guard?: BufferGuard;
}
