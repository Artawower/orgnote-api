import type { 
  SyncPlan, 
  SyncExecutor, 
  ApplyPlanResult, 
  UploadedFile, 
  DownloadedFile,
  SyncError,
  LocalFile,
  RemoteFile,
} from './types';

export const applyPlan = async (
  plan: SyncPlan,
  executor: SyncExecutor
): Promise<ApplyPlanResult> => {
  const [uploaded, uploadErrors] = await processUploads(plan.toUpload, executor);
  const [downloaded, downloadErrors] = await processDownloads(plan.toDownload, executor);
  const [deletedLocal, deleteLocalErrors] = await processDeletesLocal(plan.toDeleteLocal, executor);
  const [deletedRemote, deleteRemoteErrors] = await processDeletesRemote(plan.toDeleteRemote, executor);

  return {
    uploaded,
    downloaded,
    deletedLocal,
    deletedRemote,
    conflicts: plan.conflicts,
    errors: [...uploadErrors, ...downloadErrors, ...deleteLocalErrors, ...deleteRemoteErrors],
  };
};

const processUploads = async (
  files: LocalFile[],
  executor: SyncExecutor
): Promise<[UploadedFile[], SyncError[]]> => {
  const results = await Promise.all(files.map(file => safeUpload(file, executor)));
  return partitionResults(results);
};

const processDownloads = async (
  files: RemoteFile[],
  executor: SyncExecutor
): Promise<[DownloadedFile[], SyncError[]]> => {
  const results = await Promise.all(files.map(file => safeDownload(file, executor)));
  return partitionResults(results);
};

const processDeletesLocal = async (
  paths: string[],
  executor: SyncExecutor
): Promise<[string[], SyncError[]]> => {
  const results = await Promise.all(paths.map(path => safeDeleteLocal(path, executor)));
  return partitionResults(results);
};

const processDeletesRemote = async (
  paths: string[],
  executor: SyncExecutor
): Promise<[string[], SyncError[]]> => {
  const results = await Promise.all(paths.map(path => safeDeleteRemote(path, executor)));
  return partitionResults(results);
};

interface ResultOk<T> {
  ok: true;
  value: T;
}

interface ResultErr {
  ok: false;
  error: SyncError;
}

type Result<T> = ResultOk<T> | ResultErr;

const ok = <T>(value: T): ResultOk<T> => ({ ok: true, value });
const err = (error: SyncError): ResultErr => ({ ok: false, error });

const safeUpload = async (file: LocalFile, executor: SyncExecutor): Promise<Result<UploadedFile>> => {
  try {
    return ok(await executor.upload(file));
  } catch (e) {
    return err({ path: file.path, operation: 'upload', message: String(e) });
  }
};

const safeDownload = async (file: RemoteFile, executor: SyncExecutor): Promise<Result<DownloadedFile>> => {
  try {
    return ok(await executor.download(file));
  } catch (e) {
    return err({ path: file.path, operation: 'download', message: String(e) });
  }
};

const safeDeleteLocal = async (path: string, executor: SyncExecutor): Promise<Result<string>> => {
  try {
    await executor.deleteLocal(path);
    return ok(path);
  } catch (e) {
    return err({ path, operation: 'deleteLocal', message: String(e) });
  }
};

const safeDeleteRemote = async (path: string, executor: SyncExecutor): Promise<Result<string>> => {
  try {
    await executor.deleteRemote(path);
    return ok(path);
  } catch (e) {
    return err({ path, operation: 'deleteRemote', message: String(e) });
  }
};

const isOk = <T>(result: Result<T>): result is ResultOk<T> => result.ok;

const partitionResults = <T>(results: Result<T>[]): [T[], SyncError[]] => {
  const successes = results.filter(isOk).map(r => r.value);
  const errors = results.filter((r): r is ResultErr => !r.ok).map(r => r.error);
  return [successes, errors];
};
