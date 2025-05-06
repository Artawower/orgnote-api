import { StyleVariant } from './style-variant';

export interface NotificationConfig {
  id?: string;
  message: string;
  group?: boolean;
  timeout?: number;
  level?: StyleVariant;
  caption?: string;
  closable?: boolean;
}
