import { expect, test, vi } from 'vitest';
import { AxiosError } from 'axios';
import type { FileSystem } from '../../../models/file-system';
import { ErrorFileNotFound } from '../../../models/file-system';
import type { SyncExecutor } from '../../types';
import { handleConflict } from '../conflict';
import { createContext, SHA256_OF_ABC } from './fixtures';

test('handleConflict stores computed contentHash after server download', async () => {
  const fs = {
    copyFile: vi.fn(async () => undefined),
    fileInfo: vi.fn(async () => ({ mtime: 100, size: 3 })),
    readFile: vi.fn(async () => new TextEncoder().encode('abc')),
  } as unknown as FileSystem;
  const executor = {
    download: vi.fn(async () => undefined),
  } as unknown as SyncExecutor;
  const ctx = createContext({ fs, executor, deviceName: 'dev' });

  await handleConflict('/c.org', { status: 'conflict', serverVersion: 7 }, ctx);

  const stored = await ctx.state.getFile('/c.org');

  expect(stored?.status).toBe('synced');
  expect(stored?.version).toBe(7);
  expect(stored?.contentHash).toBe(SHA256_OF_ABC);
  expect(stored?.conflictPath).toContain('.sync-conflict-');
});

test('handleConflict removes local file and state when server version is missing', async () => {
  const fs = {
    copyFile: vi.fn(async () => undefined),
    deleteFile: vi.fn(async () => undefined),
  } as unknown as FileSystem;
  const notFoundResponse = {
    status: 404,
    statusText: 'Not Found',
    headers: {},
    config: {} as never,
    data: {},
  };
  const executor = {
    download: vi.fn(async () => {
      throw new AxiosError(
        'Not Found',
        'ERR_BAD_REQUEST',
        undefined,
        undefined,
        notFoundResponse
      );
    }),
  } as unknown as SyncExecutor;
  const ctx = createContext({ fs, executor, deviceName: 'dev' });

  await handleConflict(
    '/missing.org',
    { status: 'conflict', serverVersion: 7 },
    ctx
  );

  const stored = await ctx.state.getFile('/missing.org');

  expect(fs.deleteFile).toHaveBeenCalledWith('/missing.org');
  expect(stored).toBeNull();
});

test('handleConflict stores undefined contentHash when read fails with ErrorFileNotFound', async () => {
  const fs = {
    copyFile: vi.fn(async () => undefined),
    fileInfo: vi.fn(async () => ({ mtime: 100, size: 3 })),
    readFile: vi.fn(async () => {
      throw new ErrorFileNotFound('/c.org');
    }),
  } as unknown as FileSystem;
  const executor = {
    download: vi.fn(async () => undefined),
  } as unknown as SyncExecutor;
  const ctx = createContext({ fs, executor, deviceName: 'dev' });

  await handleConflict('/c.org', { status: 'conflict', serverVersion: 7 }, ctx);

  const stored = await ctx.state.getFile('/c.org');

  expect(stored?.status).toBe('synced');
  expect(stored?.contentHash).toBeUndefined();
});
