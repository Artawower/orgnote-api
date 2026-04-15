import type { LocalFile, SyncContext } from '../types';
import { handleConflict, tryMergeConflict } from './conflict';
import { createSyncedFile } from './synced-file';
import { resolveContentHash } from './content-hash';
import { readBinaryContent } from './read-binary-content';
import { hashContent } from '../utils/content-hash';
import { to } from '../../utils/to-error';

const persistErrorState = async (
  file: LocalFile,
  expectedVersion: number | undefined,
  error: unknown,
  ctx: SyncContext
): Promise<void> => {
  await ctx.state.setFile(
    file.path,
    createSyncedFile(file, {
      version: expectedVersion,
      status: 'error',
      errorMessage: String(error),
    })
  );
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

  const execute = ctx.baseStore
    ? to(
        (): Promise<void> =>
          executeUploadWithMergeRetry(file, expectedVersion, ctx)
      )
    : to((): Promise<void> => executeUpload(file, expectedVersion, ctx));

  const result = await execute();

  if (result.isOk()) return;

  await persistErrorState(file, expectedVersion, result.error, ctx);
  throw result.error;
};

const executeUpload = async (
  file: LocalFile,
  expectedVersion: number | undefined,
  ctx: SyncContext
): Promise<void> => {
  const result = await ctx.executor.upload(file, expectedVersion);

  if (result.status !== 'ok') {
    await handleConflict(file.path, result, ctx);
    return;
  }

  await persistSyncedSnapshot(file.path, result.version, ctx);
};

const executeUploadWithMergeRetry = async (
  file: LocalFile,
  expectedVersion: number | undefined,
  ctx: SyncContext
): Promise<void> => {
  const result = await ctx.executor.upload(file, expectedVersion);

  if (result.status === 'ok') {
    await persistSyncedSnapshot(file.path, result.version, ctx);
    return;
  }

  const baseEntry = ctx.baseStore ? await ctx.baseStore.get(file.path) : null;

  const mergedContent = await tryMergeConflict(
    file.path,
    result,
    baseEntry?.content ?? null,
    ctx
  );

  if (!mergedContent) {
    await handleConflict(file.path, result, ctx);
    return;
  }

  const contentHash = await hashContent(mergedContent);
  const mergedFile: LocalFile = { ...file, contentHash };
  const retryResult = await ctx.executor.upload(
    mergedFile,
    result.serverVersion
  );

  if (retryResult.status !== 'ok') {
    await handleConflict(file.path, retryResult, ctx);
    return;
  }

  await persistSyncedSnapshot(file.path, retryResult.version, ctx);
};

const persistSyncedSnapshot = async (
  path: string,
  version: number,
  ctx: SyncContext
): Promise<void> => {
  const fileInfo = await ctx.fs.fileInfo(path);
  const contentHash = fileInfo ? await resolveContentHash(ctx.fs, path) : '';

  await ctx.state.setFile(
    path,
    createSyncedFile(
      {
        mtime: fileInfo?.mtime ?? 0,
        size: fileInfo?.size ?? 0,
        contentHash,
      },
      { version, status: 'synced', syncedAt: ctx.serverTime }
    )
  );

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
