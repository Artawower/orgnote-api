import { VueComponent } from './vue-component';

export interface ModalConfig<T = any> {
  closable?: boolean;
  title?: string;
  modalProps?: T;
}

export interface Modal {
  config?: ModalConfig;
  component: VueComponent;
}
