import type { SyncState, SyncStateData } from './types';

export function createMemorySyncState(initial?: Partial<SyncStateData>): SyncState {
  const data: SyncStateData = {
    files: { ...initial?.files },
  };

  return {
    async get() {
      return { files: { ...data.files } };
    },

    async getFile(path) {
      return data.files[path] ?? null;
    },

    async setFile(path, file) {
      data.files[path] = { ...file };
    },

    async removeFile(path) {
      delete data.files[path];
    },

    async clear() {
      data.files = {};
    },
  };
}
