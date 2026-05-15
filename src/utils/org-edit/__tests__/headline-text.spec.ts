import { describe, expect, test } from 'vitest';
import { editOrgDocument } from '../edit-org-document';

describe('OrgHeadline — setTitle', () => {
  test('replaces title text after keyword', () => {
    const next = editOrgDocument('* TODO Old title\nBody\n', (doc) => {
      doc.headlineAt(0)?.setTitle('New title');
    });
    expect(next).toBe('* TODO New title\nBody\n');
  });

  test('preserves keyword, priority and tags', () => {
    const next = editOrgDocument(
      '* TODO [#A] Old title :work:\nBody\n',
      (doc) => {
        doc.headlineAt(0)?.setTitle('New title');
      }
    );
    expect(next).toBe('* TODO [#A] New title :work:\nBody\n');
  });

  test('headline without keyword', () => {
    const next = editOrgDocument('* Just a heading\n', (doc) => {
      doc.headlineAt(0)?.setTitle('Renamed');
    });
    expect(next).toBe('* Renamed\n');
  });
});

describe('OrgHeadline — setBody', () => {
  test('replaces body text after planning + property drawer', () => {
    const next = editOrgDocument(
      '* TODO Task\nSCHEDULED: <2026-05-13 Wed>\n:PROPERTIES:\n:STYLE: habit\n:END:\nOld body line\n',
      (doc) => {
        doc.headlineAt(0)?.setBody('New body line');
      }
    );
    expect(next).toBe(
      '* TODO Task\nSCHEDULED: <2026-05-13 Wed>\n:PROPERTIES:\n:STYLE: habit\n:END:\nNew body line\n'
    );
  });

  test('replaces body when no drawers', () => {
    const next = editOrgDocument('* TODO Task\nOld body\nLine 2\n', (doc) => {
      doc.headlineAt(0)?.setBody('Replaced');
    });
    expect(next).toBe('* TODO Task\nReplaced\n');
  });

  test('clears body when called with empty string', () => {
    const next = editOrgDocument('* TODO Task\nOld body\n', (doc) => {
      doc.headlineAt(0)?.setBody('');
    });
    expect(next).toBe('* TODO Task\n');
  });
});

describe('OrgProperties — read', () => {
  test('exposes entries from PropertyDrawer', () => {
    editOrgDocument(
      '* TODO X\n:PROPERTIES:\n:STYLE: habit\n:CUSTOM_ID: abc\n:END:\n',
      (doc) => {
        const props = doc.headlineAt(0)?.properties;
        expect(props?.get('STYLE')).toBe('habit');
        expect(props?.get('CUSTOM_ID')).toBe('abc');
        expect(Object.keys(props?.entries ?? {}).sort()).toEqual([
          'CUSTOM_ID',
          'STYLE',
        ]);
      }
    );
  });

  test('handles property keys with digits, underscores and dashes', () => {
    editOrgDocument(
      '* TODO X\n:PROPERTIES:\n:CUSTOM_ID: abc\n:LAST-REPEAT: 2026-05-13\n:V2_FLAG: on\n:END:\n',
      (doc) => {
        const props = doc.headlineAt(0)?.properties;
        expect(props?.get('CUSTOM_ID')).toBe('abc');
        expect(props?.get('LAST-REPEAT')).toBe('2026-05-13');
        expect(props?.get('V2_FLAG')).toBe('on');
      }
    );
  });

  test('keeps property with empty value as empty string', () => {
    editOrgDocument(
      '* TODO X\n:PROPERTIES:\n:STYLE:\n:CUSTOM_ID: abc\n:END:\n',
      (doc) => {
        const props = doc.headlineAt(0)?.properties;
        expect(props?.get('STYLE')).toBe('');
        expect(props?.get('CUSTOM_ID')).toBe('abc');
        expect(props?.entries).toEqual({ STYLE: '', CUSTOM_ID: 'abc' });
      }
    );
  });

  test('preserves multi-word property values', () => {
    editOrgDocument(
      '* TODO X\n:PROPERTIES:\n:DESCRIPTION: hello world\n:END:\n',
      (doc) => {
        expect(doc.headlineAt(0)?.properties.get('DESCRIPTION')).toBe(
          'hello world'
        );
      }
    );
  });

  test('returns empty entries when no drawer', () => {
    editOrgDocument('* TODO X\n', (doc) => {
      const props = doc.headlineAt(0)?.properties;
      expect(props?.entries).toEqual({});
      expect(props?.get('STYLE')).toBeUndefined();
    });
  });
});
