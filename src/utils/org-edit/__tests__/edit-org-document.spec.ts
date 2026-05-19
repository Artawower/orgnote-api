import { expect, test } from 'vitest';
import { editOrgDocument } from '../edit-org-document';

test('editOrgDocument_returnsContentUnchanged_forNoOpMutate', () => {
  const content = '* TODO Task\nBody\n';
  expect(editOrgDocument(content, () => {})).toBe(content);
});

test('editOrgDocument_exposesRoot_forEscapeHatch', () => {
  const content = '* TODO Task\n';
  let rootSeen = false;
  editOrgDocument(content, (doc) => {
    rootSeen = doc.root !== undefined;
  });
  expect(rootSeen).toBe(true);
});

test('editOrgDocument_preservesRoundTrip_withPlanningLogbookPropertyDrawer', () => {
  const content =
    '* TODO Daily\nSCHEDULED: <2026-05-13 Wed +1d>\n:LOGBOOK:\n- State "DONE" from "TODO" [2026-05-14 Thu 10:53]\n:END:\n:PROPERTIES:\n:STYLE: habit\n:END:\nBody\n';
  expect(editOrgDocument(content, () => {})).toBe(content);
});
