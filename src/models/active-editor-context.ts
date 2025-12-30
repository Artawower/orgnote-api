import type { OrgNode } from 'org-mode-ast';
import type { EditorView } from '@codemirror/view';

export interface ActiveEditorContext {
  orgNode: OrgNode | null;
  cursorPosition: number;
  editorViewGetter: () => EditorView | undefined;
  filePath?: string;
}
