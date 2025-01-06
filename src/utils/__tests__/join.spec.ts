import { test, expect } from 'vitest';
import { join } from '../join-path';

test('Should join file paths', () => {
  const samples = [
    ['dir1', 'subdir2', 'file'],
    ['dir2/', '/file'],
    ['/dri3', 'subdir2/', 'file'],
    ['file'],
  ];

  samples.forEach((sample) => {
    const result = join(...sample);
    expect(result).toMatchSnapshot();
  });
});

test('Should not take slashes from the path array into account.', () => {
  const path = ['/', 'this', '/', 'is-path', 'qwe'];
  const result = join(...path);
  expect(result).toBe('this/is-path/qwe');
});

test('Should not join empty string with additional slash', () => {
  const path = ['', 'file'];
  const result = join(...path);
  expect(result).toBe('file');
});
