import type { FileChange, SyncChangesResponse } from '../remote-api';
import type { SyncApi, RemoteFile } from './types';

type ServerFields = Pick<SyncChangesResponse, 'serverTime' | 'cursor'>;

export interface FetchResult extends ServerFields {
  files: RemoteFile[];
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

  if (!page.cursor) {
    return { files, serverTime: page.serverTime };
  }

  return fetchAllPages(api, since, page.cursor, files);
};

const toTimestamp = (isoString?: string): number | undefined => {
  if (!isoString) return undefined;
  return new Date(isoString).getTime();
};

const fetchPage = async (
  api: SyncApi,
  since?: string,
  cursor?: string
): Promise<FetchResult> => {
  const sinceMs = toTimestamp(since);
  const response = await api.syncChangesGet(sinceMs, DEFAULT_LIMIT, cursor);
  const data = response.data.data;

  return {
    files: mapChangesToFiles(data.changes),
    serverTime: data.serverTime,
    cursor: data.hasMore ? data.cursor : undefined,
  };
};

const mapChangesToFiles = (changes: FileChange[]): RemoteFile[] =>
  changes.map(toRemoteFile);

const toRemoteFile = (change: FileChange): RemoteFile => ({
  path: change.path,
  version: change.version,
  deleted: change.deleted,
  updatedAt: change.updatedAt,
});
