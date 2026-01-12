import type { Ref, ShallowRef } from 'vue';
import type { VueComponent } from './vue-component';
import type { ComponentConfig } from './sidebar-store';

export interface Panel {
  opened: Ref<boolean>;
  component: ShallowRef<VueComponent | undefined>;
  componentConfig: ShallowRef<ComponentConfig<VueComponent> | undefined>;
  close: () => void;
  open: () => void;
  toggle: () => void;
  openComponent: <T extends VueComponent>(
    cmp: T,
    config?: ComponentConfig<T>
  ) => void;
}
