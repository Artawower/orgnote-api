import { describe, expect, test } from 'vitest';
import { editOrgDocument } from '../edit-org-document';

describe('OrgLogbook — appendStateChange', () => {
  test('creates :LOGBOOK: drawer when none exists', () => {
    const next = editOrgDocument('* TODO Task\nBody\n', (doc) => {
      doc.headlineAt(0)?.logbook.appendStateChange({
        from: 'TODO',
        to: 'DONE',
        at: new Date(2026, 4, 13, 10, 53),
      });
    });
    expect(next).toBe(
      '* TODO Task\n:LOGBOOK:\n- State "DONE" from "TODO" [2026-05-13 Wed 10:53]\n:END:\nBody\n'
    );
  });

  test('drawer is inserted after Planning line', () => {
    const next = editOrgDocument(
      '* TODO Daily\nSCHEDULED: <2026-05-13 Wed +1d>\nBody\n',
      (doc) => {
        doc.headlineAt(0)?.logbook.appendStateChange({
          from: 'TODO',
          to: 'DONE',
          at: new Date(2026, 4, 13, 10, 53),
        });
      }
    );
    expect(next).toBe(
      '* TODO Daily\nSCHEDULED: <2026-05-13 Wed +1d>\n:LOGBOOK:\n- State "DONE" from "TODO" [2026-05-13 Wed 10:53]\n:END:\nBody\n'
    );
  });

  test('prepends entry to existing drawer (newest on top)', () => {
    const content =
      '* TODO Task\n:LOGBOOK:\n- State "DONE" from "TODO" [2026-05-12 Tue 09:00]\n:END:\n';
    const next = editOrgDocument(content, (doc) => {
      doc.headlineAt(0)?.logbook.appendStateChange({
        from: 'TODO',
        to: 'DONE',
        at: new Date(2026, 4, 13, 10, 53),
      });
    });
    expect(next).toBe(
      '* TODO Task\n:LOGBOOK:\n- State "DONE" from "TODO" [2026-05-13 Wed 10:53]\n- State "DONE" from "TODO" [2026-05-12 Tue 09:00]\n:END:\n'
    );
  });
});

describe('OrgLogbook — removeStateChange', () => {
  test('removes a single state-change entry by date', () => {
    const content =
      '* TODO Task\n:LOGBOOK:\n- State "DONE" from "TODO" [2026-05-13 Wed 10:53]\n- State "DONE" from "TODO" [2026-05-12 Tue 09:00]\n:END:\n';
    const next = editOrgDocument(content, (doc) => {
      const removed = doc
        .headlineAt(0)
        ?.logbook.removeStateChange({ to: 'DONE', date: '2026-05-12' });
      expect(removed).toBe(true);
    });
    expect(next).toBe(
      '* TODO Task\n:LOGBOOK:\n- State "DONE" from "TODO" [2026-05-13 Wed 10:53]\n:END:\n'
    );
  });

  test('removes the entire drawer when last entry is removed', () => {
    const content =
      '* TODO Task\n:LOGBOOK:\n- State "DONE" from "TODO" [2026-05-13 Wed 10:53]\n:END:\nBody\n';
    const next = editOrgDocument(content, (doc) => {
      const removed = doc
        .headlineAt(0)
        ?.logbook.removeStateChange({ to: 'DONE', date: '2026-05-13' });
      expect(removed).toBe(true);
    });
    expect(next).toBe('* TODO Task\nBody\n');
  });

  test('returns false when no matching entry exists', () => {
    const content =
      '* TODO Task\n:LOGBOOK:\n- State "DONE" from "TODO" [2026-05-13 Wed 10:53]\n:END:\n';
    editOrgDocument(content, (doc) => {
      const removed = doc
        .headlineAt(0)
        ?.logbook.removeStateChange({ to: 'DONE', date: '2026-05-14' });
      expect(removed).toBe(false);
    });
  });
});

describe('OrgLogbook — clear', () => {
  test('removes the entire LOGBOOK drawer', () => {
    const content =
      '* TODO Task\n:LOGBOOK:\n- State "DONE" from "TODO" [2026-05-13 Wed 10:53]\n:END:\nBody\n';
    const next = editOrgDocument(content, (doc) => {
      doc.headlineAt(0)?.logbook.clear();
    });
    expect(next).toBe('* TODO Task\nBody\n');
  });

  test('clear is no-op when no drawer', () => {
    const content = '* TODO Task\nBody\n';
    expect(
      editOrgDocument(content, (doc) => doc.headlineAt(0)?.logbook.clear())
    ).toBe(content);
  });
});

describe('OrgLogbook — clock', () => {
  test('appendClock inserts a closed clock entry', () => {
    const next = editOrgDocument('* TODO Habit\n', (doc) => {
      doc.headlineAt(0)?.logbook.appendClock({
        start: new Date(2026, 4, 13, 10, 0),
        end: new Date(2026, 4, 13, 10, 30),
      });
    });
    expect(next).toBe(
      '* TODO Habit\n:LOGBOOK:\nCLOCK: [2026-05-13 Wed 10:00]--[2026-05-13 Wed 10:30] =>  0:30\n:END:\n'
    );
  });

  test('openClock inserts a CLOCK with no end', () => {
    const next = editOrgDocument('* TODO Habit\n', (doc) => {
      doc.headlineAt(0)?.logbook.openClock(new Date(2026, 4, 13, 10, 0));
    });
    expect(next).toBe(
      '* TODO Habit\n:LOGBOOK:\nCLOCK: [2026-05-13 Wed 10:00]\n:END:\n'
    );
  });

  test('closeClock replaces matching open clock with closed range', () => {
    const content =
      '* TODO Habit\n:LOGBOOK:\nCLOCK: [2026-05-13 Wed 10:00]\n:END:\n';
    const next = editOrgDocument(content, (doc) => {
      const closed = doc.headlineAt(0)?.logbook.closeClock({
        start: new Date(2026, 4, 13, 10, 0),
        end: new Date(2026, 4, 13, 10, 30),
      });
      expect(closed).toBe(true);
    });
    expect(next).toBe(
      '* TODO Habit\n:LOGBOOK:\nCLOCK: [2026-05-13 Wed 10:00]--[2026-05-13 Wed 10:30] =>  0:30\n:END:\n'
    );
  });

  test('closeClock returns false when no matching open clock', () => {
    const content =
      '* TODO Habit\n:LOGBOOK:\nCLOCK: [2026-05-13 Wed 10:00]\n:END:\n';
    editOrgDocument(content, (doc) => {
      const closed = doc.headlineAt(0)?.logbook.closeClock({
        start: new Date(2026, 4, 14, 10, 0),
        end: new Date(2026, 4, 14, 10, 30),
      });
      expect(closed).toBe(false);
    });
  });
});

describe('OrgLogbook — entries (read)', () => {
  test('exposes parsed state-change entries', () => {
    editOrgDocument(
      '* TODO Task\n:LOGBOOK:\n- State "DONE" from "TODO" [2026-05-13 Wed 10:53]\n:END:\n',
      (doc) => {
        const entries = doc.headlineAt(0)?.logbook.entries ?? [];
        expect(entries).toHaveLength(1);
        expect(entries[0]?.type).toBe('state-change');
        expect(entries[0]?.fromKeyword).toBe('TODO');
        expect(entries[0]?.toKeyword).toBe('DONE');
      }
    );
  });
});
