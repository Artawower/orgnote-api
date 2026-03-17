import { expect, test } from 'vitest';
import { fetchRemoteChanges } from '../fetch';
import type { SyncApi } from '../types';

test('fetchRemoteChanges maps contentHash from API changes', async () => {
  const api = {
    syncChangesGet: async () => ({
      data: {
        data: {
          changes: [
            {
              id: '1',
              path: '/a.org',
              version: 1,
              deleted: false,
              updatedAt: '2024-01-01T00:00:00Z',
              contentHash: 'hash-1',
            },
          ],
          hasMore: false,
          serverTime: '2024-01-01T00:00:00Z',
        },
      },
    }),
  } as unknown as SyncApi;

  const result = await fetchRemoteChanges(api);

  expect(result.files).toHaveLength(1);
  expect(result.files[0].contentHash).toBe('hash-1');
});
