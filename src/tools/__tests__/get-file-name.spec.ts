import { getFileName, getFileNameWithoutExtension } from '../get-file-name';
import { test, expect } from 'vitest';

test('Should return file name from path', () => {
  expect(getFileName('/some/path/foo.org')).toBe('foo.org');
});

test('Should return file name from file name', () => {
  expect(getFileName('foo.org')).toBe('foo.org');
});

test('Should return file name without extension', () => {
  expect(getFileNameWithoutExtension('foo.org')).toBe('foo');
});

test('Should return file name without extension from path', () => {
  expect(getFileNameWithoutExtension('/some/path/foo.org')).toBe('foo');
});
