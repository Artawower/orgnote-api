import type { Ref, ShallowRef } from 'vue';
import { Store } from './store';
import { VueComponent } from './vue-component';
import { Modal, ModalConfig } from './modal';
import { ComputedRef } from 'vue';

export interface ModalStore {
  open: <TReturn = unknown>(
    cmp: VueComponent,
    config?: ModalConfig
  ) => Promise<TReturn>;
  title: Ref<string>;
  close: <TReturn = unknown>(data?: TReturn) => void;
  component: ComputedRef<VueComponent>;
  config: ComputedRef<ModalConfig>;
  closeAll: () => void;
  modals: ShallowRef<Modal[]>;
  updateConfig: (config: Partial<ModalConfig>) => void;
}

export type ModalStoreDefinition = Store<ModalStore>;
