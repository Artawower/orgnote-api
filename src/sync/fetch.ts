import type { FileChange, SyncChangesResponse } from '../remote-api';
import type { SyncApi, RemoteFile } from './types';

type ServerFields = Pick<SyncChangesResponse, 'serverTime' | 'cursor'>;

export interface FetchResult extends ServerFields {
  files: RemoteFile[];
}

export interface InvalidSyncChangesResponseDetails {
  operation: string;
  reason: string;
  responseKind: string;
  status?: number;
  contentType?: string;
  topLevelKeys: string[];
  dataKeys: string[];
}

export class InvalidSyncChangesResponseError extends Error {
  readonly details: InvalidSyncChangesResponseDetails;

  constructor(details: InvalidSyncChangesResponseDetails) {
    super('Invalid sync changes response. Check the configured API URL.', { cause: details });
    this.name = 'InvalidSyncChangesResponseError';
    this.details = details;
  }
}

const DEFAULT_LIMIT = 100;
const SYNC_CHANGES_OPERATION = 'syncChangesGet';

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
  const data = getSyncChangesData(response.data);

  if (!data) {
    throw new InvalidSyncChangesResponseError(createInvalidResponseDetails(response));
  }

  return {
    files: mapChangesToFiles(data.changes),
    serverTime: data.serverTime,
    cursor: data.hasMore ? data.cursor : undefined,
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getDataField = (body: unknown): unknown => (isRecord(body) ? body.data : undefined);

const getKeys = (value: unknown): string[] => (isRecord(value) ? Object.keys(value) : []);

const getSyncChangesData = (body: unknown): SyncChangesResponse | null => {
  if (getInvalidSyncChangesReason(body)) return null;
  return getDataField(body) as SyncChangesResponse;
};

const getInvalidSyncChangesReason = (body: unknown): string | undefined => {
  const data = getDataField(body);
  if (!isRecord(data)) return 'missing_data';
  if (!Array.isArray(data.changes)) return 'missing_changes';
  if (typeof data.serverTime !== 'string') return 'invalid_server_time';
  if (typeof data.hasMore !== 'boolean') return 'invalid_has_more';
  if (data.hasMore && typeof data.cursor !== 'string') return 'missing_cursor';
  return undefined;
};

const getResponseKind = (body: unknown): string => {
  if (typeof body === 'string') {
    return body.trimStart().startsWith('<') ? 'html' : 'text';
  }
  if (Array.isArray(body)) return 'array';
  if (isRecord(body)) return 'json-object';
  return typeof body;
};

const createInvalidResponseDetails = (response: unknown): InvalidSyncChangesResponseDetails => {
  const body = isRecord(response) ? response.data : undefined;
  return {
    operation: SYNC_CHANGES_OPERATION,
    reason: getInvalidSyncChangesReason(body) ?? 'invalid_response_shape',
    responseKind: getResponseKind(body),
    status: getResponseStatus(response),
    contentType: getContentType(response),
    topLevelKeys: getKeys(body),
    dataKeys: getKeys(getDataField(body)),
  };
};

const getResponseStatus = (response: unknown): number | undefined => {
  if (!isRecord(response)) return undefined;
  return typeof response.status === 'number' ? response.status : undefined;
};

const getContentType = (response: unknown): string | undefined => {
  if (!isRecord(response)) return undefined;
  return getHeader(response.headers, 'content-type');
};

const getHeader = (headers: unknown, name: string): string | undefined => {
  if (hasHeaderGetter(headers)) return toHeaderValue(headers.get(name));
  if (!isRecord(headers)) return undefined;
  const entry = Object.entries(headers).find(([key]) => key.toLowerCase() === name);
  return toHeaderValue(entry?.[1]);
};

const hasHeaderGetter = (headers: unknown): headers is { get: (name: string) => unknown } =>
  isRecord(headers) && typeof headers.get === 'function';

const toHeaderValue = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return undefined;
};

const mapChangesToFiles = (changes: FileChange[]): RemoteFile[] =>
  changes.map(toRemoteFile);

const toRemoteFile = (change: FileChange): RemoteFile => ({
  path: change.path,
  version: change.version,
  deleted: change.deleted,
  updatedAt: change.updatedAt,
  contentHash: change.contentHash,
});
