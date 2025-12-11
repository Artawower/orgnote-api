import type { FileSystem, DiskFile } from '../models/file-system';
import type { LocalFile, SyncStateData } from './types';

const DEFAULT_IGNORE = ['.git', '.DS_Store', 'node_modules', '.sync-state', '.Trash'];

export async function scanLocalFiles(
  fs: FileSystem,
  rootPath: string,
  ignorePatterns: string[] = []
): Promise<LocalFile[]> {
  const ignore = [...DEFAULT_IGNORE, ...ignorePatterns];
  return scanDir(fs, rootPath, '', ignore);
}

async function scanDir(
  fs: FileSystem,
  rootPath: string,
  relativePath: string,
  ignore: string[]
): Promise<LocalFile[]> {
  const fullPath = joinPath(rootPath, relativePath);
  const entries = await fs.readDir(fullPath);

  const filteredEntries = entries.filter(entry => !shouldIgnore(entry.name, ignore));

  const nestedResults = await Promise.all(
    filteredEntries.map(entry => processEntry(fs, rootPath, relativePath, entry, ignore))
  );

  return nestedResults.flat();
}

async function processEntry(
  fs: FileSystem,
  rootPath: string,
  relativePath: string,
  entry: DiskFile,
  ignore: string[]
): Promise<LocalFile[]> {
  const entryPath = joinPath(relativePath, entry.name);

  if (entry.type === 'directory') {
    return scanDir(fs, rootPath, entryPath, ignore);
  }

  return [toLocalFile(entryPath, entry)];
}

const normalizePath = (path: string): string =>
  path.startsWith('/') ? path.slice(1) : path;

const toLocalFile = (path: string, entry: DiskFile): LocalFile => ({
  path: normalizePath(path),
  mtime: entry.mtime,
  size: entry.size,
});

const joinPath = (base: string, segment: string): string =>
  segment ? `${base}/${segment}` : base;

const shouldIgnore = (name: string, patterns: string[]): boolean =>
  patterns.some(pattern => matchPattern(pattern, name));

const matchPattern = (pattern: string, name: string): boolean => {
  if (!pattern.includes('*')) return name === pattern;
  
  const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
  return regex.test(name);
};

export const findDeletedLocally = (
  localFiles: LocalFile[],
  stateData: SyncStateData
): string[] => {
  const localPaths = new Set(localFiles.map(f => f.path));
  return Object.keys(stateData.files).filter(path => !localPaths.has(path));
};
