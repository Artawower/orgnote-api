import type { RemoteFile, SyncContext, SyncedFile } from '../types';
import { createSyncedFile } from './synced-file';

const storedMeta = (stored: SyncedFile | null) => ({
  mtime: stored?.mtime ?? 0,
  size: stored?.size ?? 0,
});

export const processDownload = async (file: RemoteFile, ctx: SyncContext): Promise<void> => {
  const stored = await ctx.state.getFile(file.path);
  const meta = storedMeta(stored);

  await ctx.state.setFile(file.path, createSyncedFile(meta, { version: stored?.version, status: 'downloading' }));

  try {
    await ctx.executor.download(file);
    const fileInfo = await ctx.fs.fileInfo(file.path);
    const downloadedMeta = { mtime: fileInfo?.mtime ?? 0, size: fileInfo?.size ?? 0 };

    await ctx.state.setFile(
      file.path,
      createSyncedFile(downloadedMeta, { version: file.version, status: 'synced', syncedAt: ctx.serverTime })
    );
  } catch (error) {
    await ctx.state.setFile(
      file.path,
      createSyncedFile(meta, { version: stored?.version, status: 'error', errorMessage: String(error) })
    );
    throw error;
  }
};
