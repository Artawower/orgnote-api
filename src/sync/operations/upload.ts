import type { LocalFile, SyncContext } from '../types';
import { handleConflict } from './conflict';
import { createSyncedFile } from './synced-file';

const executeUpload = async (
  file: LocalFile,
  expectedVersion: number | undefined,
  ctx: SyncContext
): Promise<void> => {
  const result = await ctx.executor.upload(file, expectedVersion);

  if (result.status === 'ok') {
    await ctx.state.setFile(
      file.path,
      createSyncedFile(file, {
        version: result.version,
        status: 'synced',
        syncedAt: ctx.serverTime,
      })
    );
    return;
  }

  await handleConflict(file.path, result, ctx);
};

export const processUpload = async (
  file: LocalFile,
  ctx: SyncContext
): Promise<void> => {
  const stored = await ctx.state.getFile(file.path);
  const expectedVersion = stored?.version;

  await ctx.state.setFile(
    file.path,
    createSyncedFile(file, { version: expectedVersion, status: 'uploading' })
  );

  try {
    await executeUpload(file, expectedVersion, ctx);
  } catch (error) {
    await ctx.state.setFile(
      file.path,
      createSyncedFile(file, {
        version: expectedVersion,
        status: 'error',
        errorMessage: String(error),
      })
    );
    throw error;
  }
};
