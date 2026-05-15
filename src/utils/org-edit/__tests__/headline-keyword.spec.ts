import { describe, expect, test } from 'vitest';
import { editOrgDocument } from '../edit-org-document';

describe('OrgHeadline — todo keyword', () => {
  test('setTodoKeyword TODO -> DONE same length', () => {
    const next = editOrgDocument('* TODO Task\n', (doc) => {
      doc.headlineAt(0)?.setTodoKeyword('DONE');
    });
    expect(next).toBe('* DONE Task\n');
  });

  test('setTodoKeyword shorter', () => {
    const next = editOrgDocument('* TODO Task\nBody\n', (doc) => {
      doc.headlineAt(0)?.setTodoKeyword('NEXT');
    });
    expect(next).toBe('* NEXT Task\nBody\n');
  });

  test('setTodoKeyword longer keyword shifts neighbour positions', () => {
    const next = editOrgDocument('* TODO Task\n** TODO Child\n', (doc) => {
      doc.headlineAt(0)?.setTodoKeyword('IN-PROGRESS');
    });
    expect(next).toBe('* IN-PROGRESS Task\n** TODO Child\n');
  });

  test('multiple keyword changes within one mutate', () => {
    const next = editOrgDocument('* TODO A\n* TODO B\n', (doc) => {
      doc.headlineAt(0)?.setTodoKeyword('DONE');
      doc
        .headlineAt('* TODO A\n* TODO B\n'.indexOf('* TODO B'))
        ?.setTodoKeyword('DONE');
    });
    expect(next).toBe('* DONE A\n* DONE B\n');
  });
});
