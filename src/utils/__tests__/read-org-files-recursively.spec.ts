import { describe, it, expect, vi } from 'vitest';
import { readOrgFilesRecursively } from '../find-notes-files-diff';
import { FileScanParams } from '../../models';

// NOTE: AI generated
const mockReadDir = vi.fn();
const mockFileInfo = vi.fn();

describe('readOrgFilesRecursively', () => {
  it('should read .org files recursively from a directory', async () => {
    const mockFileSystem: FileScanParams = {
      fileInfo: mockFileInfo,
      readDir: mockReadDir,
      dirPath: '/root',
    };

    // Set up fake file system structure
    mockReadDir.mockImplementation(async (path) => {
      switch (path) {
        case '/root':
          return [
            { name: 'file1.org', type: 'file', size: 100, mtime: Date.now() },
            { name: 'subdir', type: 'directory', size: 0, mtime: Date.now() },
            { name: 'file2.txt', type: 'file', size: 200, mtime: Date.now() },
          ];
        case '/root/subdir':
          return [
            { name: 'file3.org', type: 'file', size: 100, mtime: Date.now() },
            { name: 'file4.md', type: 'file', size: 150, mtime: Date.now() },
          ];
        default:
          return [];
      }
    });

    // Execute the function
    const orgFiles = await readOrgFilesRecursively(mockFileSystem);

    // Check results
    expect(orgFiles).toEqual(['/root/file1.org', '/root/subdir/file3.org']);
    expect(mockReadDir).toHaveBeenCalledTimes(2);
  });

  it('should return an empty array if no .org files are found', async () => {
    const mockFileSystem: FileScanParams = {
      fileInfo: mockFileInfo,
      readDir: mockReadDir,
      dirPath: '/emptyDir',
    };

    // Set up fake file system structure with no .org files
    mockReadDir.mockResolvedValue([]);

    // Execute the function
    const orgFiles = await readOrgFilesRecursively(mockFileSystem);

    // Check results
    expect(orgFiles).toEqual([]);
    expect(mockReadDir).toHaveBeenCalledWith('/emptyDir');
  });
});
