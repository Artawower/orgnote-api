import { describe, expect, test } from 'vitest';
import { parseOrgPlanningDate } from '../shared/parse-org-stamp';

describe('parseOrgPlanningDate', () => {
  test('active date-only', () => {
    const result = parseOrgPlanningDate('<2026-05-13 Wed>');
    expect(result).toEqual({
      date: '2026-05-13',
      hasTime: false,
      active: true,
      repeater: undefined,
      warning: undefined,
    });
  });

  test('inactive timestamp with time embeds time in date field', () => {
    const result = parseOrgPlanningDate('[2026-05-13 Wed 10:30]');
    expect(result?.date).toBe('2026-05-13T10:30');
    expect(result?.hasTime).toBe(true);
    expect(result?.active).toBe(false);
  });

  test('repeater +', () => {
    const result = parseOrgPlanningDate('<2026-05-13 Wed +1d>');
    expect(result?.repeater).toEqual({ type: '+', value: 1, unit: 'd' });
  });

  test('repeater ++', () => {
    const result = parseOrgPlanningDate('<2026-05-13 Wed ++2w>');
    expect(result?.repeater).toEqual({ type: '++', value: 2, unit: 'w' });
  });

  test('repeater .+', () => {
    const result = parseOrgPlanningDate('<2026-05-13 Wed .+3m>');
    expect(result?.repeater).toEqual({ type: '.+', value: 3, unit: 'm' });
  });

  test('warning -', () => {
    const result = parseOrgPlanningDate('<2026-05-13 Wed -1d>');
    expect(result?.warning).toEqual({ type: '-', value: 1, unit: 'd' });
    expect(result?.repeater).toBeUndefined();
  });

  test('repeater and warning together', () => {
    const result = parseOrgPlanningDate('<2026-05-13 Wed +1d -2d>');
    expect(result?.repeater).toEqual({ type: '+', value: 1, unit: 'd' });
    expect(result?.warning).toEqual({ type: '-', value: 2, unit: 'd' });
  });

  test('all hour/day/week/month/year repeater units', () => {
    expect(parseOrgPlanningDate('<2026-05-13 Wed +1h>')?.repeater?.unit).toBe(
      'h'
    );
    expect(parseOrgPlanningDate('<2026-05-13 Wed +1d>')?.repeater?.unit).toBe(
      'd'
    );
    expect(parseOrgPlanningDate('<2026-05-13 Wed +1w>')?.repeater?.unit).toBe(
      'w'
    );
    expect(parseOrgPlanningDate('<2026-05-13 Wed +1m>')?.repeater?.unit).toBe(
      'm'
    );
    expect(parseOrgPlanningDate('<2026-05-13 Wed +1y>')?.repeater?.unit).toBe(
      'y'
    );
  });

  test('returns undefined for malformed input', () => {
    expect(parseOrgPlanningDate(undefined)).toBeUndefined();
    expect(parseOrgPlanningDate('')).toBeUndefined();
    expect(parseOrgPlanningDate('not a date')).toBeUndefined();
    expect(parseOrgPlanningDate('<2026-05-13>')).toBeUndefined();
    expect(parseOrgPlanningDate('[2026-05-13 Wed>')).toBeUndefined();
    expect(parseOrgPlanningDate('2026-05-13')).toBeUndefined();
  });

  test('trims surrounding whitespace', () => {
    const result = parseOrgPlanningDate('  <2026-05-13 Wed>  ');
    expect(result?.date).toBe('2026-05-13');
  });
});
