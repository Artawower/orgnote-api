import { Ref } from 'vue';
import { QueueTask } from './queue-task';
import { StoreDefinition } from './store';

export type ProcessCallback = (err?: unknown, result?: unknown) => void;
export type ProcessFn = (task: unknown, cb: ProcessCallback) => void;

export interface QueueCreationOptions {
  concurrent?: number;
  maxRetries?: number;
  retryDelay?: number;
  maxTimeout?: number;
  batchSize?: number;
  batchDelay?: number;
  afterProcessDelay?: number;
  filo?: boolean;
  id?:
    | string
    | ((task: unknown, cb: (err: unknown, id: string) => void) => void);
  cancelIfRunning?: boolean;
  autoResume?: boolean;
  failTaskOnProcessException?: boolean;
  process?: ProcessFn;
}

export interface QueueTaskOptions {
  priority?: number;
  delay?: number;
  timeout?: number;
  [key: string]: unknown;
}
export interface QueueStats {
  total: number;
  average: number;
  successRate: number;
  peak: number;
}

export interface QueueStore {
  queueIds: Ref<string[]>;

  register(queueId: string, options?: QueueCreationOptions): unknown;
  unregister(queueId?: string): void;
  getQueue(queueId?: string): unknown | undefined;
  destroy(queueId?: string): void;
  add(
    payload: unknown,
    options?: QueueTaskOptions,
    queueId?: string
  ): Promise<string>;
  getAll(queueId?: string): Promise<QueueTask[]>;
  get(taskId: string, queueId?: string): Promise<QueueTask | undefined>;
  remove(taskId: string, queueId?: string): Promise<void>;
  pause(queueId?: string): void;
  resume(queueId?: string): void;
  getStats(queueId?: string): Promise<QueueStats>;
  clear(queueId?: string): Promise<void>;
  executeBatchTasks<T = unknown[], R = unknown[]>(
    options: QueueCreationOptions,
    data: T[]
  ): Promise<R>;
}

export type QueueStoreDefinition = StoreDefinition<QueueStore>;
