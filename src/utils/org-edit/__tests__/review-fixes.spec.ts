import { describe, expect, test } from 'vitest';
import { editOrgDocument } from '../edit-org-document';

describe('advanceRepeater — calendar arithmetic', () => {
  test('+1m from 2026-01-31 clamps to last day of February (2026-02-28)', () => {
    const next = editOrgDocument(
      '* TODO Monthly\nSCHEDULED: <2026-01-31 Sat +1m>\n',
      (doc) => {
        doc
          .headlineAt(0)
          ?.scheduled.advanceRepeater(new Date(2026, 0, 31, 12, 0));
      }
    );
    expect(next).toBe('* TODO Monthly\nSCHEDULED: <2026-02-28 Sat +1m>\n');
  });

  test('+1m from 2026-01-15 advances to 2026-02-15 (no clamp needed)', () => {
    const next = editOrgDocument(
      '* TODO Monthly\nSCHEDULED: <2026-01-15 Thu +1m>\n',
      (doc) => {
        doc
          .headlineAt(0)
          ?.scheduled.advanceRepeater(new Date(2026, 0, 15, 12, 0));
      }
    );
    expect(next).toBe('* TODO Monthly\nSCHEDULED: <2026-02-15 Sun +1m>\n');
  });

  test('+1y from 2024-02-29 (leap) clamps to 2025-02-28', () => {
    const next = editOrgDocument(
      '* TODO Yearly\nSCHEDULED: <2024-02-29 Thu +1y>\n',
      (doc) => {
        doc
          .headlineAt(0)
          ?.scheduled.advanceRepeater(new Date(2024, 1, 29, 12, 0));
      }
    );
    expect(next).toBe('* TODO Yearly\nSCHEDULED: <2025-02-28 Fri +1y>\n');
  });

  test('+1y from 2024-06-15 advances to 2025-06-15', () => {
    const next = editOrgDocument(
      '* TODO Yearly\nSCHEDULED: <2024-06-15 Sat +1y>\n',
      (doc) => {
        doc
          .headlineAt(0)
          ?.scheduled.advanceRepeater(new Date(2024, 5, 15, 12, 0));
      }
    );
    expect(next).toBe('* TODO Yearly\nSCHEDULED: <2025-06-15 Sun +1y>\n');
  });
});

describe('OrgHeadline — live getters', () => {
  test('todoKeyword reflects the AST after setTodoKeyword', () => {
    editOrgDocument('* TODO Task\n', (doc) => {
      const h = doc.headlineAt(0);
      expect(h?.todoKeyword).toBe('TODO');
      h?.setTodoKeyword('DONE');
      expect(h?.todoKeyword).toBe('DONE');
    });
  });

  test('text returns real title body, not a placeholder', () => {
    editOrgDocument('* TODO [#A] Real title :work:\n', (doc) => {
      expect(doc.headlineAt(0)?.text).toBe('Real title');
    });
  });

  test('priority returns the priority letter', () => {
    editOrgDocument('* TODO [#A] Task\n', (doc) => {
      expect(doc.headlineAt(0)?.priority).toBe('A');
    });
    editOrgDocument('* TODO Task\n', (doc) => {
      expect(doc.headlineAt(0)?.priority).toBeUndefined();
    });
  });

  test('tags returns parsed tags array', () => {
    editOrgDocument('* TODO Task :work:project:\n', (doc) => {
      expect(doc.headlineAt(0)?.tags).toEqual(['work', 'project']);
    });
    editOrgDocument('* TODO Task\n', (doc) => {
      expect(doc.headlineAt(0)?.tags).toEqual([]);
    });
  });

  test('body returns text after planning + property drawer', () => {
    editOrgDocument(
      '* TODO Task\nSCHEDULED: <2026-05-13 Wed>\n:PROPERTIES:\n:STYLE: habit\n:END:\nLine 1\nLine 2\n',
      (doc) => {
        expect(doc.headlineAt(0)?.body).toBe('Line 1\nLine 2');
      }
    );
  });

  test('body is empty when no body content', () => {
    editOrgDocument('* TODO Task\n', (doc) => {
      expect(doc.headlineAt(0)?.body).toBe('');
    });
  });

  test('text reflects setTitle mutation', () => {
    editOrgDocument('* TODO Old\n', (doc) => {
      const h = doc.headlineAt(0);
      h?.setTitle('Renamed');
      expect(h?.text).toBe('Renamed');
    });
  });
});

describe('detachNode — shared helper', () => {
  test('a parsed snippet child can be re-attached after detach', async () => {
    const { detachNode } = await import('../shared/detach-node');
    const { parse, NodeType } = await import('org-mode-ast');
    const parent = parse('* X\nA\n');
    const snippet = parse('* X\nB\n');
    const headline = snippet.childrenList.find((n) => n.is(NodeType.Headline));
    const text = headline?.section?.childrenList.find((n) =>
      n.is(NodeType.Text)
    );
    if (!text) throw new Error('test setup');
    headline?.section?.removeNode(text);
    detachNode(text);
    const parentSection = parent.childrenList.find((n) =>
      n.is(NodeType.Headline)
    )?.section;
    parentSection?.addChild(text);
    // After detach + addChild, parent should now serialise with both texts.
    // org-mode-ast strips the trailing NewLine of the snippet's section when we
    // pull only the Text node out, so the result has the source NewLine but not
    // the snippet's NewLine.
    expect(parent.rawValue).toBe('* X\nA\nB');
  });
});
