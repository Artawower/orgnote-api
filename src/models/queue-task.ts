export type QueueStatus =
  | 'completed'
  | 'failed'
  | 'pending'
  | 'processing'
  | 'canceled';

export interface QueueTask {
  id: string;
  task: unknown;
  queueId: string;
  priority: number;
  added: number;
  started?: number;
  retries?: number;
  failed?: number;
  lockId?: string;
  status?: QueueStatus;
  deletedAt?: number;
  [key: string]: unknown;
}
