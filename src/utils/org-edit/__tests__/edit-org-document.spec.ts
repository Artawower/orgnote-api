import { describe, expect, test } from 'vitest';
import { editOrgDocument } from '../edit-org-document';

describe('editOrgDocument — entry point', () => {
  test('no-op mutate returns content unchanged', () => {
    const content = '* TODO Task\nBody\n';
    expect(editOrgDocument(content, () => {})).toBe(content);
  });

  test('exposes root via doc.root for escape hatch', () => {
    const content = '* TODO Task\n';
    let rootSeen = false;
    editOrgDocument(content, (doc) => {
      rootSeen = doc.root !== undefined;
    });
    expect(rootSeen).toBe(true);
  });

  test('preserves planning + logbook + property drawer round-trip', () => {
    const content =
      '* TODO Daily\nSCHEDULED: <2026-05-13 Wed +1d>\n:LOGBOOK:\n- State "DONE" from "TODO" [2026-05-14 Thu 10:53]\n:END:\n:PROPERTIES:\n:STYLE: habit\n:END:\nBody\n';
    expect(editOrgDocument(content, () => {})).toBe(content);
  });
});
