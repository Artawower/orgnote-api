import { LogLevel, LogRecord } from './log';
import type { ResultAsync } from 'neverthrow';

export interface LogFilter {
  level?: LogLevel;
  from?: Date;
  to?: Date;
  text?: string;
  limit?: number;
  offset?: number;
}

export interface LoggerRepository {
  add(record: LogRecord): ResultAsync<void, Error>;
  bulkAdd(records: LogRecord[]): ResultAsync<void, Error>;
  query(filter: LogFilter): ResultAsync<LogRecord[], Error>;
  count(
    filter?: Omit<LogFilter, 'limit' | 'offset'>
  ): ResultAsync<number, Error>;
  clear(): ResultAsync<void, Error>;
  purgeOlderThan(date: Date): ResultAsync<void, Error>;
}
