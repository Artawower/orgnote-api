import type { DefineComponent } from 'vue';

export type VueComponent<
  Props = Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Emits = Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
> = DefineComponent<Props, {}, any, {}, {}, {}, Emits>;
