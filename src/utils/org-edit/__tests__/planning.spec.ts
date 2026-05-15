import { describe, expect, test } from 'vitest';
import { editOrgDocument } from '../edit-org-document';

describe('OrgPlanningSlot — read', () => {
  test('reads existing scheduled date with repeater', () => {
    editOrgDocument(
      '* TODO Daily\nSCHEDULED: <2026-05-13 Wed +1d>\n',
      (doc) => {
        const h = doc.headlineAt(0);
        expect(h?.scheduled.value?.date).toBe('2026-05-13');
        expect(h?.scheduled.value?.active).toBe(true);
        expect(h?.scheduled.value?.repeater?.type).toBe('+');
        expect(h?.scheduled.value?.repeater?.value).toBe(1);
        expect(h?.scheduled.value?.repeater?.unit).toBe('d');
      }
    );
  });

  test('reads inactive closed timestamp with time', () => {
    editOrgDocument('* DONE Task\nCLOSED: [2026-05-13 Wed 10:00]\n', (doc) => {
      const h = doc.headlineAt(0);
      expect(h?.closed.value?.date).toBe('2026-05-13T10:00');
      expect(h?.closed.value?.hasTime).toBe(true);
      expect(h?.closed.value?.active).toBe(false);
    });
  });

  test('value is undefined when slot absent', () => {
    editOrgDocument('* TODO Task\n', (doc) => {
      const h = doc.headlineAt(0);
      expect(h?.scheduled.value).toBeUndefined();
      expect(h?.deadline.value).toBeUndefined();
      expect(h?.closed.value).toBeUndefined();
    });
  });
});

describe('OrgPlanningSlot — set', () => {
  test('updates existing scheduled and preserves repeater', () => {
    const next = editOrgDocument(
      '* TODO Daily\nSCHEDULED: <2026-05-13 Wed +1d>\n',
      (doc) => {
        doc.headlineAt(0)?.scheduled.set(new Date(2026, 4, 14));
      }
    );
    expect(next).toBe('* TODO Daily\nSCHEDULED: <2026-05-14 Thu +1d>\n');
  });

  test('overrides repeater via options', () => {
    const next = editOrgDocument(
      '* TODO Daily\nSCHEDULED: <2026-05-13 Wed +1d>\n',
      (doc) => {
        doc.headlineAt(0)?.scheduled.set(new Date(2026, 4, 14), {
          repeater: { type: '+', value: 2, unit: 'w' },
        });
      }
    );
    expect(next).toBe('* TODO Daily\nSCHEDULED: <2026-05-14 Thu +2w>\n');
  });

  test('clears repeater when options.repeater === null', () => {
    const next = editOrgDocument(
      '* TODO Daily\nSCHEDULED: <2026-05-13 Wed +1d>\n',
      (doc) => {
        doc
          .headlineAt(0)
          ?.scheduled.set(new Date(2026, 4, 14), { repeater: null });
      }
    );
    expect(next).toBe('* TODO Daily\nSCHEDULED: <2026-05-14 Thu>\n');
  });

  test('adding CLOSED to existing SCHEDULED puts CLOSED first per org convention', () => {
    const next = editOrgDocument(
      '* TODO Task\nSCHEDULED: <2026-05-13 Wed>\nBody\n',
      (doc) => {
        doc.headlineAt(0)?.closed.set(new Date(2026, 4, 13, 10, 0));
      }
    );
    expect(next).toBe(
      '* TODO Task\nCLOSED: [2026-05-13 Wed 10:00] SCHEDULED: <2026-05-13 Wed>\nBody\n'
    );
  });

  test('sets closed when no Planning line exists yet', () => {
    const next = editOrgDocument('* TODO Task\nBody\n', (doc) => {
      doc.headlineAt(0)?.closed.set(new Date(2026, 4, 13, 10, 0));
    });
    expect(next).toBe('* TODO Task\nCLOSED: [2026-05-13 Wed 10:00]\nBody\n');
  });

  test('adds scheduled to existing planning that only has closed', () => {
    const next = editOrgDocument(
      '* TODO Task\nCLOSED: [2026-05-13 Wed 10:00]\nBody\n',
      (doc) => {
        doc.headlineAt(0)?.scheduled.set(new Date(2026, 4, 14), {
          repeater: { type: '+', value: 1, unit: 'd' },
        });
      }
    );
    expect(next).toBe(
      '* TODO Task\nCLOSED: [2026-05-13 Wed 10:00] SCHEDULED: <2026-05-14 Thu +1d>\nBody\n'
    );
  });
});

describe('OrgPlanningSlot — clear', () => {
  test('removes the entire planning line when last slot is cleared', () => {
    const next = editOrgDocument(
      '* TODO Task\nCLOSED: [2026-05-13 Wed 10:00]\nBody\n',
      (doc) => {
        doc.headlineAt(0)?.closed.clear();
      }
    );
    expect(next).toBe('* TODO Task\nBody\n');
  });

  test('preserves remaining planning entries', () => {
    const next = editOrgDocument(
      '* TODO Task\nCLOSED: [2026-05-13 Wed 10:00] SCHEDULED: <2026-05-14 Thu>\n',
      (doc) => {
        doc.headlineAt(0)?.closed.clear();
      }
    );
    expect(next).toBe('* TODO Task\nSCHEDULED: <2026-05-14 Thu>\n');
  });

  test('clear on absent slot is a no-op', () => {
    const content = '* TODO Task\n';
    const next = editOrgDocument(content, (doc) => {
      doc.headlineAt(0)?.closed.clear();
    });
    expect(next).toBe(content);
  });
});

describe('OrgPlanningSlot — advanceRepeater', () => {
  test('advances scheduled date with daily repeater past `from`', () => {
    const next = editOrgDocument(
      '* TODO Daily\nSCHEDULED: <2026-05-13 Wed +1d>\n',
      (doc) => {
        const advanced = doc
          .headlineAt(0)
          ?.scheduled.advanceRepeater(new Date(2026, 4, 13, 12, 0));
        expect(advanced).toBe(true);
      }
    );
    expect(next).toBe('* TODO Daily\nSCHEDULED: <2026-05-14 Thu +1d>\n');
  });

  test('advanceRepeater returns false when no repeater', () => {
    editOrgDocument('* TODO Task\nSCHEDULED: <2026-05-13 Wed>\n', (doc) => {
      expect(
        doc.headlineAt(0)?.scheduled.advanceRepeater(new Date(2026, 4, 13))
      ).toBe(false);
    });
  });

  test('rewindRepeater inverts a daily advance', () => {
    const advanced = editOrgDocument(
      '* TODO Daily\nSCHEDULED: <2026-05-13 Wed +1d>\n',
      (doc) => {
        doc
          .headlineAt(0)
          ?.scheduled.advanceRepeater(new Date(2026, 4, 13, 12, 0));
      }
    );
    expect(advanced).toContain('SCHEDULED: <2026-05-14 Thu +1d>');

    const next = editOrgDocument(advanced, (doc) => {
      expect(doc.headlineAt(0)?.scheduled.rewindRepeater()).toBe(true);
    });
    expect(next).toBe('* TODO Daily\nSCHEDULED: <2026-05-13 Wed +1d>\n');
  });

  test('rewindRepeater on monthly date clamps to last day when needed', () => {
    const next = editOrgDocument(
      '* TODO Monthly\nSCHEDULED: <2026-03-31 Tue +1m>\n',
      (doc) => {
        doc.headlineAt(0)?.scheduled.rewindRepeater();
      }
    );
    expect(next).toBe('* TODO Monthly\nSCHEDULED: <2026-02-28 Sat +1m>\n');
  });

  test('rewindRepeater returns false when no repeater', () => {
    editOrgDocument('* TODO Task\nSCHEDULED: <2026-05-13 Wed>\n', (doc) => {
      expect(doc.headlineAt(0)?.scheduled.rewindRepeater()).toBe(false);
    });
  });
});
