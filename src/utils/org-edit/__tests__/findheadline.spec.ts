import { describe, expect, test, vi } from 'vitest';
import { editOrgDocument } from '../edit-org-document';

describe('OrgDocument.findHeadline — short-circuits', () => {
  test('predicate is invoked at most once per headline up to the match', () => {
    const content = '* TODO A\n* TODO B\n* DONE C\n* TODO D\n';
    const predicate = vi.fn(
      (h: { todoKeyword?: string }) => h.todoKeyword === 'DONE'
    );

    editOrgDocument(content, (doc) => {
      const found = doc.findHeadline(predicate);
      expect(found?.todoKeyword).toBe('DONE');
    });

    // A, B, C → 3 calls, D never visited.
    expect(predicate).toHaveBeenCalledTimes(3);
  });

  test('returns undefined when nothing matches and visits every headline', () => {
    const content = '* TODO A\n* TODO B\n';
    const predicate = vi.fn(() => false);

    editOrgDocument(content, (doc) => {
      expect(doc.findHeadline(predicate)).toBeUndefined();
    });

    expect(predicate).toHaveBeenCalledTimes(2);
  });
});
