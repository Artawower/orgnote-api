import type { FileSystem, DiskFile } from '../models/file-system';
import type { LocalFile, SyncStateData } from './types';
import { toAbsolutePath } from '../utils/to-absolute-path';

const DEFAULT_IGNORE = [
  '.git',
  '.DS_Store',
  'node_modules',
  '.sync-state',
  '.Trash',
];

export async function scanLocalFiles(
  fs: FileSystem,
  rootPath: string,
  ignorePatterns: string[] = []
): Promise<LocalFile[]> {
  const ignore = [...DEFAULT_IGNORE, ...ignorePatterns];
  return scanDir(fs, rootPath, ignore);
}

async function scanDir(
  fs: FileSystem,
  path: string,
  ignore: string[]
): Promise<LocalFile[]> {
  const entries = await fs.readDir(path);
  const filteredEntries = entries.filter((e) => !shouldIgnore(e.name, ignore));

  const nestedResults = await Promise.all(
    filteredEntries.map((entry) => processEntry(fs, entry, ignore))
  );

  return nestedResults.flat();
}

async function processEntry(
  fs: FileSystem,
  entry: DiskFile,
  ignore: string[]
): Promise<LocalFile[]> {
  if (entry.type === 'directory') {
    return scanDir(fs, entry.path, ignore);
  }

  return [toLocalFile(entry)];
}

const toLocalFile = (entry: DiskFile): LocalFile => ({
  path: toAbsolutePath(entry.path),
  mtime: entry.mtime,
  size: entry.size,
});

const shouldIgnore = (name: string, patterns: string[]): boolean =>
  patterns.some((pattern) => matchPattern(pattern, name));

const matchPattern = (pattern: string, name: string): boolean => {
  if (!pattern.includes('*')) return name === pattern;

  const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
  return regex.test(name);
};

export const findDeletedLocally = (
  localFiles: LocalFile[],
  stateData: SyncStateData
): string[] => {
  const localPaths = new Set(localFiles.map((f) => f.path));
  return Object.keys(stateData.files).filter((path) => !localPaths.has(path));
};
