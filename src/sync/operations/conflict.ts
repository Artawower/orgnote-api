import axios from 'axios';
import type { FileSystem } from '../../models/file-system';
import type { MergeInputs, SyncContext, UploadResult } from '../types';
import { MergeOutcome } from '../types';
import { createSyncedFile } from './synced-file';
import { resolveContentHash } from './content-hash';
import { readBinaryContent } from './read-binary-content';
import { mergeText } from '../merge/text-merge';
import { isMergeableFile } from '../types';
import { to } from '../../utils/to-error';

type ConflictUploadResult = Extract<UploadResult, { status: 'conflict' }>;

export const generateConflictPath = (
  path: string,
  deviceName: string = 'device'
): string => {
  const lastDot = path.lastIndexOf('.');
  const ext = lastDot >= 0 ? path.substring(lastDot) : '';
  const base = lastDot >= 0 ? path.substring(0, lastDot) : path;
  const timestamp = Date.now();
  const safeDeviceName = deviceName.replace(/[^a-zA-Z0-9_-]/g, '_');

  return `${base}.sync-conflict-${timestamp}-${safeDeviceName}${ext}`;
};

const copyFile = async (
  fs: FileSystem,
  src: string,
  dest: string
): Promise<void> => {
  if (fs.copyFile) {
    await fs.copyFile(src, dest);
    return;
  }

  const content = await fs.readFile(src, 'binary');
  await fs.writeFile(dest, content);
};

const isAxiosNotFound = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false;
  return error.response?.status === 404;
};

const refreshBaseStore = async (
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

const removeBaseStoreEntry = async (
  path: string,
  ctx: SyncContext
): Promise<void> => {
  if (!ctx.baseStore) return;

  await ctx.baseStore.remove(path);
};

const downloadRemoteContent = async (
  path: string,
  version: number,
  ctx: SyncContext
): Promise<Uint8Array | null> => {
  const result = await to(ctx.executor.download)({
    path,
    version,
    deleted: false,
    updatedAt: new Date().toISOString(),
  });

  if (result.isErr()) {
    if (isAxiosNotFound(result.error)) return null;
    throw result.error;
  }

  return readBinaryContent(ctx.fs, path);
};

const isDirty = async (path: string, ctx: SyncContext): Promise<boolean> => {
  if (!ctx.isDirtyFile) return false;
  return ctx.isDirtyFile(path);
};

const canAttemptMerge = async (
  path: string,
  baseContent: Uint8Array | null,
  ctx: SyncContext
): Promise<boolean> => {
  const fileInfo = await ctx.fs.fileInfo(path);
  if (!fileInfo) {
    return false;
  }

  if (!isMergeableFile(path, fileInfo.size)) {
    return false;
  }

  if (!baseContent) {
    return false;
  }

  const dirty = await isDirty(path, ctx);
  if (dirty) {
    return false;
  }

  return true;
};

export const tryMergeConflict = async (
  path: string,
  conflictResult: ConflictUploadResult,
  baseContent: Uint8Array | null,
  ctx: SyncContext
): Promise<Uint8Array | null> => {
  if (!(await canAttemptMerge(path, baseContent, ctx))) return null;

  const localContent = await readBinaryContent(ctx.fs, path);

  let remoteContent: Uint8Array | null;
  try {
    remoteContent = await downloadRemoteContent(
      path,
      conflictResult.serverVersion,
      ctx
    );
  } catch (error) {
    await ctx.fs.writeFile(path, localContent);
    throw error;
  }

  if (!remoteContent) {
    await ctx.fs.writeFile(path, localContent);
    return null;
  }

  const inputs: MergeInputs = {
    base: baseContent,
    local: localContent,
    remote: remoteContent,
  };

  const mergeResult = mergeText(inputs);

  if (
    mergeResult.outcome !== MergeOutcome.Merged ||
    !mergeResult.mergedContent
  ) {
    return null;
  }

  await ctx.fs.writeFile(path, mergeResult.mergedContent);
  return mergeResult.mergedContent;
};

const tryDownloadServerVersion = async (
  path: string,
  serverVersion: number,
  ctx: SyncContext
): Promise<boolean> => {
  const result = await to(ctx.executor.download)({
    path,
    version: serverVersion,
    deleted: false,
    updatedAt: new Date().toISOString(),
  });

  if (result.isErr()) {
    if (isAxiosNotFound(result.error)) return false;
    throw result.error;
  }

  return true;
};

export const handleConflict = async (
  path: string,
  conflictResult: ConflictUploadResult,
  ctx: SyncContext
): Promise<void> => {
  const conflictPath = generateConflictPath(path, ctx.deviceName);

  await copyFile(ctx.fs, path, conflictPath);

  const downloaded = await tryDownloadServerVersion(
    path,
    conflictResult.serverVersion,
    ctx
  );

  if (!downloaded) {
    await ctx.fs.deleteFile(path);
    await ctx.state.removeFile(path);
    await removeBaseStoreEntry(path, ctx);
    return;
  }

  const fileInfo = await ctx.fs.fileInfo(path);
  const contentHash = await resolveContentHash(ctx.fs, path);
  const meta = {
    mtime: fileInfo?.mtime ?? 0,
    size: fileInfo?.size ?? 0,
    contentHash,
  };

  await ctx.state.setFile(
    path,
    createSyncedFile(meta, {
      version: conflictResult.serverVersion,
      status: 'synced',
      conflictPath,
    })
  );

  await refreshBaseStore(path, conflictResult.serverVersion, contentHash, ctx);
};

export const hasConflict = (file: { conflictPath?: string }): boolean =>
  file.conflictPath !== undefined;
