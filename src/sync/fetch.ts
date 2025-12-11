import type { ModelsFileChange } from '../remote-api';
import type { SyncApi } from './types';
import type { RemoteFile } from './types';

export interface FetchResult {
  files: RemoteFile[];
  serverTime: string;
}

interface PageResult {
  files: RemoteFile[];
  serverTime: string;
  nextCursor?: string;
}

const DEFAULT_LIMIT = 100;

export const fetchRemoteChanges = async (
  api: SyncApi,
  since?: string
): Promise<FetchResult> => fetchAllPages(api, since);

const fetchAllPages = async (
  api: SyncApi,
  since?: string,
  cursor?: string,
  accumulated: RemoteFile[] = []
): Promise<FetchResult> => {
  const page = await fetchPage(api, since, cursor);
  const files = [...accumulated, ...page.files];

  if (!page.nextCursor) {
    return { files, serverTime: page.serverTime };
  }

  return fetchAllPages(api, since, page.nextCursor, files);
};

const fetchPage = async (
  api: SyncApi,
  since?: string,
  cursor?: string
): Promise<PageResult> => {
  const response = await api.syncChangesGet(since, DEFAULT_LIMIT, cursor);
  const data = response.data.data;

  return {
    files: mapChangesToFiles(data.changes),
    serverTime: data.serverTime,
    nextCursor: data.hasMore ? data.cursor : undefined,
  };
};

const mapChangesToFiles = (changes: ModelsFileChange[]): RemoteFile[] =>
  changes.map(toRemoteFile);

const toRemoteFile = (change: ModelsFileChange): RemoteFile => ({
  id: change.id,
  path: change.filePath,
  version: change.version,
  deleted: change.deleted,
  updatedAt: change.updatedAt,
});
