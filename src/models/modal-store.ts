import type { Ref, ShallowRef } from 'vue';
import { Store } from './store';
import { VueComponent } from './vue-component';
import { Modal, ModalConfig } from './modal';
import { ComputedRef } from 'vue';

export interface ModalStore {
  open: (cmp: VueComponent, config?: ModalConfig) => Promise<void>;
  title: Ref<string>;
  close: () => void;
  component: ComputedRef<VueComponent>;
  config: ComputedRef<ModalConfig>;
  closeAll: () => void;
  modals: ShallowRef<Modal[]>;
}

export type ModalStoreDefinition = Store<ModalStore>;
