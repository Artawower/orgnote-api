import type { FileSystem } from '../../models/file-system';
import type { SyncContext, UploadResult } from '../types';
import { createSyncedFile } from './synced-file';

type ConflictUploadResult = Extract<UploadResult, { status: 'conflict' }>;

export const generateConflictPath = (path: string, deviceName: string = 'device'): string => {
  const lastDot = path.lastIndexOf('.');
  const ext = lastDot >= 0 ? path.substring(lastDot) : '';
  const base = lastDot >= 0 ? path.substring(0, lastDot) : path;
  const timestamp = Date.now();

  return `${base}.sync-conflict-${timestamp}-${deviceName}${ext}`;
};

const copyFile = async (fs: FileSystem, src: string, dest: string): Promise<void> => {
  if (fs.copyFile) {
    await fs.copyFile(src, dest);
    return;
  }

  const content = await fs.readFile(src, 'binary');
  await fs.writeFile(dest, content);
};

const isNotFoundError = (error: unknown): boolean => {
  if (typeof error !== 'object' || error === null) return false;
  const axiosError = error as { response?: { status?: number } };
  return axiosError.response?.status === 404;
};

const tryDownloadServerVersion = async (
  path: string,
  serverVersion: number,
  ctx: SyncContext
): Promise<boolean> => {
  try {
    await ctx.executor.download({
      path,
      version: serverVersion,
      deleted: false,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    if (isNotFoundError(error)) return false;
    throw error;
  }
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
    return;
  }

  const fileInfo = await ctx.fs.fileInfo(path);
  const meta = { mtime: fileInfo?.mtime ?? 0, size: fileInfo?.size ?? 0 };

  await ctx.state.setFile(
    path,
    createSyncedFile(meta, {
      version: conflictResult.serverVersion,
      status: 'synced',
      conflictPath,
    })
  );
};

export const hasConflict = (file: { conflictPath?: string }): boolean =>
  file.conflictPath !== undefined;
