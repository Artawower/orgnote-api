import type { ComputedRef, ShallowRef } from 'vue';
import type {
  InlineEmbeddedWidgets,
  MultilineEmbeddedWidgets,
  OrgLineClasses,
} from './widget';
import type { EditorExtension } from './editor';
import type { WidgetMeta } from '../api';
import type { StoreDefinition } from './store';

export interface EditorStore {
  inlineWidgets: ComputedRef<InlineEmbeddedWidgets>;
  multilineWidgets: ComputedRef<MultilineEmbeddedWidgets>;
  lineClasses: ComputedRef<OrgLineClasses>;
  extensions: ShallowRef<EditorExtension[]>;

  addWidgets: (...widgets: WidgetMeta[]) => void;
  removeWidget: (widgetId: string) => void;
  addExtensions: (...extensions: EditorExtension[]) => void;
  removeExtensions: (...extensions: EditorExtension[]) => void;
}

export type EditorStoreDefinition = StoreDefinition<EditorStore>;
