export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface LogRecord {
  id?: number;
  ts: Date;
  level: LogLevel;
  message: string;
  bindings?: Record<string, unknown>;
  context?: Record<string, unknown>;
  repeatCount?: number;
  firstTs?: Date;
  lastTs?: Date;
}
