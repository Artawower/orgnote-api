import { NotificationConfig } from './notification-config';
import { Store } from './store';
import { Ref } from 'vue';

export interface NotificationsStore {
  notify: (config: NotificationConfig) => void;
  clear: () => void;
  delete: (notificationId: string) => void;
  markAsRead: (notificationId: string) => void;

  notifications: Ref<
    {
      read?: boolean;
      config: NotificationConfig;
    }[]
  >;
}

export type NotificationsStoreDefinition = Store<NotificationsStore>;
