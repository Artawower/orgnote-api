import { expect, test, vi } from 'vitest';
import type { DiskFile, FileSystem } from '../../models/file-system';
import { createMemorySyncState } from '../memory-state';
import { createSyncPlan } from '../create-sync-plan';
import type { SyncApi } from '../types';

const createSyncApiMock = (): SyncApi => {
  const syncChangesGet = vi.fn(async () => ({
    data: {
      data: {
        changes: [],
        hasMore: false,
        serverTime: '2024-01-01T00:00:00Z',
      },
    },
  }));

  return { syncChangesGet } as unknown as SyncApi;
};

const createFsMock = (
  entries: DiskFile[],
  readFileImpl: (
    path: string,
    encoding?: 'utf8' | 'binary'
  ) => Promise<Uint8Array>
): FileSystem => {
  const readFile = vi.fn(readFileImpl);

  return {
    readDir: vi.fn(async () => entries),
    readFile,
  } as unknown as FileSystem;
};

test('createSyncPlan falls back to original file when hash read fails', async () => {
  const fs = createFsMock(
    [{ name: 'a.org', path: '/a.org', type: 'file', size: 10, mtime: 10 }],
    async () => {
      throw new Error('file locked');
    }
  );
  const api = createSyncApiMock();
  const state = createMemorySyncState();

  const plan = await createSyncPlan({
    fs,
    api,
    state,
    rootPath: '/',
    enableContentHashCheck: true,
  });

  expect(plan.toUpload).toHaveLength(1);
  expect(plan.toUpload[0].path).toBe('/a.org');
  expect(plan.toUpload[0].contentHash).toBeUndefined();
});

test('createSyncPlan skips hashing when enableContentHashCheck is false', async () => {
  const fs = createFsMock(
    [{ name: 'a.org', path: '/a.org', type: 'file', size: 10, mtime: 10 }],
    async () => {
      throw new Error('must not be called');
    }
  );
  const api = createSyncApiMock();
  const state = createMemorySyncState();

  const plan = await createSyncPlan({
    fs,
    api,
    state,
    rootPath: '/',
    enableContentHashCheck: false,
  });

  expect(plan.toUpload).toHaveLength(1);
  expect(fs.readFile).toHaveBeenCalledTimes(0);
});
