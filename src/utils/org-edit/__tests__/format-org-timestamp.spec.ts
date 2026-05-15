import { describe, expect, test } from 'vitest';
import {
  formatInactiveTimestamp,
  formatOrgStamp,
} from '../shared/format-org-timestamp';

describe('formatOrgStamp', () => {
  test('active date-only', () => {
    const result = formatOrgStamp(new Date(2026, 4, 13, 10, 53), {
      active: true,
      withTime: false,
    });
    expect(result).toBe('<2026-05-13 Wed>');
  });

  test('active date with time and daily repeater', () => {
    const result = formatOrgStamp(new Date(2026, 4, 13, 10, 53), {
      active: true,
      withTime: true,
      repeater: { type: '+', value: 1, unit: 'd' },
    });
    expect(result).toBe('<2026-05-13 Wed 10:53 +1d>');
  });

  test('inactive timestamp', () => {
    const result = formatInactiveTimestamp(new Date(2026, 4, 13, 10, 53));
    expect(result).toBe('[2026-05-13 Wed 10:53]');
  });

  test('warning suffix included after repeater', () => {
    const result = formatOrgStamp(new Date(2026, 4, 13, 10, 53), {
      active: true,
      withTime: false,
      repeater: { type: '+', value: 1, unit: 'd' },
      warning: { type: '-', value: 2, unit: 'd' },
    });
    expect(result).toBe('<2026-05-13 Wed +1d -2d>');
  });
});
