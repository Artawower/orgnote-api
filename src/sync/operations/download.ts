import type { RemoteFile, SyncContext, SyncedFile } from '../types';
import { createSyncedFile } from './synced-file';
import { resolveContentHash } from './content-hash';
import { readBinaryContent } from './read-binary-content';

const storedMeta = (stored: SyncedFile | null) => ({
  mtime: stored?.mtime ?? 0,
  size: stored?.size ?? 0,
});

const markDownloading = async (
  file: RemoteFile,
  stored: SyncedFile | null,
  ctx: SyncContext
): Promise<void> => {
  await ctx.state.setFile(
    file.path,
    createSyncedFile(storedMeta(stored), {
      version: stored?.version,
      status: 'downloading',
      syncedAt: stored?.syncedAt,
    })
  );
};

const resolveDownloadedMeta = async (
  file: RemoteFile,
  ctx: SyncContext
): Promise<{ mtime: number; size: number; contentHash?: string }> => {
  const fileInfo = await ctx.fs.fileInfo(file.path);
  const contentHash = await resolveContentHash(
    ctx.fs,
    file.path,
    file.contentHash
  );

  return {
    mtime: fileInfo?.mtime ?? 0,
    size: fileInfo?.size ?? 0,
    contentHash,
  };
};

const markSynced = async (
  file: RemoteFile,
  meta: { mtime: number; size: number; contentHash?: string },
  ctx: SyncContext
): Promise<void> => {
  await ctx.state.setFile(
    file.path,
    createSyncedFile(meta, {
      version: file.version,
      status: 'synced',
      syncedAt: ctx.serverTime,
    })
  );
};

const markError = async (
  file: RemoteFile,
  stored: SyncedFile | null,
  error: unknown,
  ctx: SyncContext
): Promise<void> => {
  await ctx.state.setFile(
    file.path,
    createSyncedFile(storedMeta(stored), {
      version: stored?.version,
      status: 'error',
      syncedAt: stored?.syncedAt,
      errorMessage: String(error),
    })
  );
};

const refreshBaseStoreAfterDownload = async (
  path: string,
  version: number,
  contentHash: string,
  ctx: SyncContext
): Promise<void> => {
  if (!ctx.baseStore) return;

  const content = await readBinaryContent(ctx.fs, path);
  await ctx.baseStore.set(path, {
    path,
    version,
    contentHash,
    content,
    updatedAt: ctx.serverTime,
  });
};

export const processDownload = async (
  file: RemoteFile,
  ctx: SyncContext
): Promise<void> => {
  const stored = await ctx.state.getFile(file.path);
  await markDownloading(file, stored, ctx);

  try {
    await ctx.executor.download(file);
    const downloadedMeta = await resolveDownloadedMeta(file, ctx);
    await markSynced(file, downloadedMeta, ctx);
    await refreshBaseStoreAfterDownload(file.path, file.version, downloadedMeta.contentHash ?? '', ctx);
  } catch (error) {
    await markError(file, stored, error, ctx);
    throw error;
  }
};
