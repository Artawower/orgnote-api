import { StyleVariant } from './style-variant';

export interface NotificationConfig {
  id?: string;
  message: string;
  description?: string;
  group?: boolean;
  timeout?: number;
  level?: StyleVariant;
  caption?: string;
  closable?: boolean;
  icon?: string;
  iconEnabled?: boolean;
  onClick?: () => void;
  stored?: boolean;
}
