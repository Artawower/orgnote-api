import type { SyncStateData } from '../types';

export const getOldestSyncedAt = (stateData: SyncStateData): string | undefined => {
  const syncedTimes = Object.values(stateData.files)
    .map((f) => f.syncedAt)
    .filter((t): t is string => Boolean(t));

  if (syncedTimes.length === 0) {
    return undefined;
  }

  return syncedTimes.reduce((oldest, current) =>
    new Date(current) < new Date(oldest) ? current : oldest
  );
};
