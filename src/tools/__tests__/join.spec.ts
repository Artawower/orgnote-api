import { test, expect } from 'vitest';
import { join } from '../join';

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
