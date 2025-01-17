import { VueComponent } from './vue-component';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ModalConfig<T = any> {
  closable?: boolean;
  title?: string;
  modalProps?: T;
  mini?: boolean;
  headerTitleComponent?: VueComponent;
}

export interface Modal {
  config?: ModalConfig;
  component: VueComponent;
}
