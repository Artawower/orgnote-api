import type { SyncContext } from '../types';

const isNotFoundError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  return error.message.includes('404') || error.message.includes('not found');
};

export const processDeleteRemote = async (path: string, ctx: SyncContext): Promise<void> => {
  const stored = await ctx.state.getFile(path);

  try {
    await ctx.executor.deleteRemote(path, stored?.version ?? 0);
    await ctx.state.removeFile(path);
    await removeBaseStoreEntry(path, ctx);
  } catch (error) {
    if (isNotFoundError(error)) {
      await ctx.state.removeFile(path);
      await removeBaseStoreEntry(path, ctx);
      return;
    }

    if (stored) {
      await ctx.state.setFile(path, {
        ...stored,
        status: 'error',
        errorMessage: String(error),
      });
    }
    throw error;
  }
};

const removeBaseStoreEntry = async (
  path: string,
  ctx: SyncContext
): Promise<void> => {
  if (!ctx.baseStore) return;

  await ctx.baseStore.remove(path);
};
