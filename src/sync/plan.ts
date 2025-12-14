import type { LocalFile, RemoteFile, SyncPlan, SyncStateData, SyncedFile } from './types';
import { SyncOperationType } from './types';

type FileAction =
  | { type: SyncOperationType.Upload; file: LocalFile }
  | { type: SyncOperationType.Download; file: RemoteFile }
  | { type: SyncOperationType.DeleteLocal; path: string }
  | { type: SyncOperationType.DeleteRemote; path: string }
  | { type: 'none' };

interface FileIndex {
  remoteByPath: Map<string, RemoteFile>;
  localByPath: Map<string, LocalFile>;
  deletedSet: Set<string>;
}

export interface CreatePlanParams {
  localFiles: LocalFile[];
  deletedLocally: string[];
  remoteFiles: RemoteFile[];
  stateData: SyncStateData;
  serverTime: string;
}

export const createPlan = ({
  localFiles,
  deletedLocally,
  remoteFiles,
  stateData,
  serverTime,
}: CreatePlanParams): SyncPlan => {
  const index = buildFileIndex(localFiles, deletedLocally, remoteFiles);

  const localActions = localFiles.map(local =>
    resolveLocalFile(local, index.remoteByPath.get(local.path), stateData.files[local.path])
  );

  const deletedActions = deletedLocally.map(path =>
    resolveDeletedLocally(path, index.remoteByPath.get(path), stateData.files[path])
  );

  const remoteActions = remoteFiles
    .filter(remote => isNewRemote(remote, index))
    .map(resolveNewRemote);

  return buildPlanFromActions([...localActions, ...deletedActions, ...remoteActions], serverTime);
};

const buildFileIndex = (
  localFiles: LocalFile[],
  deletedLocally: string[],
  remoteFiles: RemoteFile[]
): FileIndex => ({
  remoteByPath: new Map(remoteFiles.map(f => [f.path, f])),
  localByPath: new Map(localFiles.map(f => [f.path, f])),
  deletedSet: new Set(deletedLocally),
});

const isNewRemote = (remote: RemoteFile, index: FileIndex): boolean =>
  !index.localByPath.has(remote.path) && !index.deletedSet.has(remote.path);

const buildPlanFromActions = (actions: FileAction[], serverTime: string): SyncPlan =>
  actions.reduce<SyncPlan>(
    (plan, action) => applyAction(plan, action),
    { toUpload: [], toDownload: [], toDeleteLocal: [], toDeleteRemote: [], serverTime }
  );

type ActionHandler<T extends FileAction = FileAction> = (plan: SyncPlan, action: T) => SyncPlan;

const actionHandlers: { [K in FileAction['type']]: ActionHandler<Extract<FileAction, { type: K }>> } = {
  [SyncOperationType.Upload]: (plan, action) => ({ ...plan, toUpload: [...plan.toUpload, action.file] }),
  [SyncOperationType.Download]: (plan, action) => ({ ...plan, toDownload: [...plan.toDownload, action.file] }),
  [SyncOperationType.DeleteLocal]: (plan, action) => ({ ...plan, toDeleteLocal: [...plan.toDeleteLocal, action.path] }),
  [SyncOperationType.DeleteRemote]: (plan, action) => ({ ...plan, toDeleteRemote: [...plan.toDeleteRemote, action.path] }),
  none: (plan) => plan,
};

const applyAction = (plan: SyncPlan, action: FileAction): SyncPlan =>
  actionHandlers[action.type](plan, action as never);

const resolveLocalFile = (
  local: LocalFile,
  remote: RemoteFile | undefined,
  stored: SyncedFile | undefined
): FileAction => {
  const localChanged = isLocalChanged(local, stored);

  if (!remote) {
    return localChanged ? upload(local) : none();
  }

  if (remote.deleted) {
    return localChanged ? upload(local) : deleteLocal(local.path);
  }

  const remoteChanged = isRemoteChanged(remote, stored);

  if (localChanged && remoteChanged) {
    return upload(local);
  }

  if (localChanged) return upload(local);
  if (remoteChanged) return download(remote);

  return none();
};

const resolveDeletedLocally = (
  path: string,
  remote: RemoteFile | undefined,
  stored: SyncedFile | undefined
): FileAction => {
  if (!remote || remote.deleted) {
    return deleteRemote(path);
  }

  return isRemoteChanged(remote, stored) ? download(remote) : deleteRemote(path);
};

const resolveNewRemote = (remote: RemoteFile): FileAction =>
  remote.deleted ? none() : download(remote);

const isLocalChanged = (local: LocalFile, stored?: SyncedFile): boolean =>
  !stored || local.mtime !== stored.mtime || stored.status === 'error';

const isRemoteChanged = (remote: RemoteFile, stored?: SyncedFile): boolean =>
  !stored || remote.version > (stored.version ?? 0);

const upload = (file: LocalFile): FileAction => ({ type: SyncOperationType.Upload, file });
const download = (file: RemoteFile): FileAction => ({ type: SyncOperationType.Download, file });
const deleteLocal = (path: string): FileAction => ({ type: SyncOperationType.DeleteLocal, path });
const deleteRemote = (path: string): FileAction => ({ type: SyncOperationType.DeleteRemote, path });
const none = (): FileAction => ({ type: 'none' });
