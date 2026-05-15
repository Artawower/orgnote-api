import { describe, expect, test } from 'vitest';
import { parse, NodeType } from 'org-mode-ast';
import {
  collectAllHeadlines,
  findHeadlineAt,
} from '../shared/find-headline-at';

describe('findHeadlineAt', () => {
  test('three-level nesting — deepest containing headline wins', () => {
    const content = '* L1\n** L2\n*** L3\nbody\n';
    const root = parse(content);
    const l3Start = content.indexOf('*** L3');
    const found = findHeadlineAt(root, l3Start);
    expect(found?.level).toBe(3);
  });

  test('offset inside L2 section but before L3 returns L2', () => {
    const content = '* L1\n** L2\nbody of L2\n*** L3\n';
    const root = parse(content);
    const inL2Body = content.indexOf('body of L2');
    const found = findHeadlineAt(root, inL2Body);
    expect(found?.level).toBe(2);
  });

  test('offset at headline start matches that headline', () => {
    const content = '* First\n* Second\n';
    const root = parse(content);
    const found = findHeadlineAt(root, content.indexOf('* Second'));
    expect(found?.title?.rawValue.trim()).toBe('* Second');
  });

  test('offset beyond all headlines returns undefined', () => {
    const content = '* TODO Task\n';
    const root = parse(content);
    expect(findHeadlineAt(root, content.length + 10)).toBeUndefined();
  });

  test('document without any headline returns undefined', () => {
    const root = parse('Just some text\nNo headlines here\n');
    expect(findHeadlineAt(root, 0)).toBeUndefined();
  });

  test('empty document returns undefined', () => {
    const root = parse('');
    expect(findHeadlineAt(root, 0)).toBeUndefined();
  });
});

describe('collectAllHeadlines', () => {
  test('returns empty array for document without headlines', () => {
    expect(collectAllHeadlines(parse('Just text\n'))).toEqual([]);
  });

  test('returns flat list of top-level headlines', () => {
    const root = parse('* A\n* B\n* C\n');
    const headlines = collectAllHeadlines(root);
    expect(headlines).toHaveLength(3);
    expect(headlines.every((h) => h.is(NodeType.Headline))).toBe(true);
  });

  test('includes nested headlines in depth-first order', () => {
    const root = parse('* A\n** A1\n** A2\n*** A2a\n* B\n');
    const headlines = collectAllHeadlines(root);
    expect(headlines.map((h) => h.level)).toEqual([1, 2, 2, 3, 1]);
  });
});
