import type { ComputedRef, ShallowRef } from 'vue';
import type {
  InlineEmbeddedWidgets,
  MultilineEmbeddedWidgets,
  OrgLineClasses,
} from './widget';
import type { EditorExtension } from './editor';
import type { WidgetMeta } from '../api';
import type { StoreDefinition } from './store';
import type { ActiveEditorContext } from './active-editor-context';

export interface EditorStore {
  inlineWidgets: ComputedRef<InlineEmbeddedWidgets>;
  multilineWidgets: ComputedRef<MultilineEmbeddedWidgets>;
  lineClasses: ComputedRef<OrgLineClasses>;
  extensions: ShallowRef<EditorExtension[]>;

  activeContext: ShallowRef<ActiveEditorContext | null>;

  addWidgets: (...widgets: WidgetMeta[]) => void;
  removeWidget: (widgetId: string) => void;
  addExtensions: (...extensions: EditorExtension[]) => void;
  removeExtensions: (...extensions: EditorExtension[]) => void;

  selection: ComputedRef<string>;
  hasSelection: ComputedRef<boolean>;

  setActiveContext: (ctx: Partial<ActiveEditorContext>) => void;
  updateActiveContext: (ctx: Partial<ActiveEditorContext>) => void;
  clearActiveContext: () => void;
}

export type EditorStoreDefinition = StoreDefinition<EditorStore>;
