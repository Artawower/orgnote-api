import type { OrgNode } from 'org-mode-ast';
import type { Component } from 'vue';
import type { EditorView } from 'codemirror';
import type { Extension } from '@codemirror/state';

interface DynamicComponent {
  mount: (
    cmp: Component,
    wrap: Element,
    props?: { [key: string]: unknown }
  ) => {
    destroy: () => void;
    refresh: (...args: unknown[]) => void;
  };
}

export interface EditorExtensionParams {
  orgNodeGetter: () => OrgNode;
  readonly: boolean;
  showSpecialSymbols?: boolean;
  dynamicComponent: DynamicComponent;
  editorViewGetter: () => EditorView;
}

export type EditorExtension = (params: EditorExtensionParams) => Extension;
